document.addEventListener('DOMContentLoaded',()=> {
  const cta = document.getElementById('cta');
  if(cta){
    cta.addEventListener('click',()=> {
      alert('Thanks! Check the in-game event board for details.');
    });
  }
  console.log('Cabal Sea Saga event page loaded');
});
