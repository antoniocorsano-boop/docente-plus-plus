// Aggiungere queste funzioni a InClasseDataManager.prototype (data-manager.js)

// Aggiunge una valutazione (grade / behavior / note) all'istanza lezione
InClasseDataManager.prototype.addEvaluationToInstance = async function(lessonInstanceId, studentId, evaluation){
  // evaluation: { type: 'grade'|'behavior'|'note', value, activityType?, note?, evaluatorId? }
  if (!lessonInstanceId) throw new Error('lessonInstanceId required');
  const inst = await this.getLessonInstance(lessonInstanceId);
  if (!inst) throw new Error('lesson instance not found');

  inst.evaluations = inst.evaluations || {};
  inst.evaluations[studentId] = inst.evaluations[studentId] || { grades: [], behavior: [], observations: [], lastUpdated: null };

  const now = (new Date()).toISOString();
  const evaluatorId = evaluation.evaluatorId || null;

  if (evaluation.type === 'grade'){
    // normalize numeric value
    const val = Number(evaluation.value);
    inst.evaluations[studentId].grades.push({ value: val, activityType: evaluation.activityType || null, timestamp: now, evaluatorId });
  } else if (evaluation.type === 'behavior'){
    inst.evaluations[studentId].behavior.push({ emoji: evaluation.value, timestamp: now, evaluatorId });
  } else if (evaluation.type === 'note'){
    inst.evaluations[studentId].observations.push({ text: evaluation.value || evaluation.note || '', timestamp: now, evaluatorId });
  } else {
    throw new Error('unknown evaluation.type');
  }

  inst.evaluations[studentId].lastUpdated = now;
  inst.updatedAt = now;

  const { store } = await getStore('readwrite', STORES.INSTANCES);
  const req = store.put(inst);
  await promisifyRequest(req);

  // broadcast event (UI code can also dispatch its own)
  try{ document.dispatchEvent(new CustomEvent('evaluationUpdated', { detail: { lessonInstanceId: inst.id, studentId, evaluation } })); }catch(e){ /* ignore */ }

  return inst;
};

// Calcola analytics base per una lesson instance: avgGrade e comportamento (trend semplice)
InClasseDataManager.prototype.computeAnalytics = async function(lessonInstanceId){
  const inst = await this.getLessonInstance(lessonInstanceId);
  if (!inst) throw new Error('lesson instance not found');

  const result = {};
  const evals = inst.evaluations || {};

  for (const studentId of Object.keys(evals)){
    const s = evals[studentId];
    // average grade
    const grades = (s.grades || []).map(g => Number(g.value)).filter(v => !isNaN(v));
    const avgGrade = grades.length ? (grades.reduce((a,b)=>a+b,0) / grades.length) : null;

    // behavior trend: simple heuristic (count emojis)
    const behaviors = s.behavior || [];
    let pos = 0, neg = 0;
    behaviors.forEach(b => {
      if (!b || !b.emoji) return;
      if (String(b.emoji).includes('😊')) pos++;
      else if (String(b.emoji).includes('😟')) neg++;
    });
    const behaviorTrend = pos > neg ? 'up' : (neg > pos ? 'down' : 'stable');

    result[studentId] = {
      avgGrade,
      behaviorTrend,
      lastUpdated: s.lastUpdated || null,
      gradesCount: grades.length,
      behaviorCount: behaviors.length
    };
  }

  return result;
};
