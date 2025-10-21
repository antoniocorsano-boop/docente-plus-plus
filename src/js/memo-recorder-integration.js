/* Integration helper: when a memo/recording is saved, if a lessonInstance is active, attach it
   to the lesson instance via InClasseDataManager.addRecordingToInstance
*/
(function(window){
  function tryIntegrate(recMeta){
    try{
      const instanceId = localStorage.getItem('currentLessonInstanceId');
      if (!instanceId) return;
      if (window.inClasseDataManager && typeof window.inClasseDataManager.addRecordingToInstance === 'function'){
        window.inClasseDataManager.addRecordingToInstance(instanceId, recMeta).catch(e=>console.error('Add recording to instance failed', e));
      }
    }catch(e){ console.error(e); }
  }

  // Patch MemoRecorder.save to call tryIntegrate after save (if exists)
  function patch(){
    if (!window.MemoRecorder) return;
    const proto = window.MemoRecorder.prototype;
    if (!proto) return;
    const origSave = proto.save;
    if (typeof origSave !== 'function') return;
    proto.save = async function(){
      const res = await origSave.apply(this, arguments);
      try{
        if (this.currentBlob){
          const meta = { id: 'rec_'+Date.now(), duration: this.duration, filename: 'memo-'+Date.now()+'.webm' };
          tryIntegrate(meta);
        }
      }catch(e){ console.error('integration patch error', e); }
      return res;
    };
  }

  // Try patch on load and also when MemoRecorder becomes available
  if (window.MemoRecorder) patch();
  else window.addEventListener('load', ()=>{ setTimeout(()=>patch(), 200); });

})(window);