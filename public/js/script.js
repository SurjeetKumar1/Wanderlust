// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  // index.js js
  let taxtSwitch=document.getElementById("switchCheckDefault");
  taxtSwitch.addEventListener("click",()=>{
    let textInfo=document.getElementsByClassName("textInfo");
    for(info of textInfo){
      if(info.style.display!="inline"){
      info.style.display="inline";
    }else{
      info.style.display="none";
    }
  }
    console.log("clicked");
  })

  const leftBtn = document.getElementById("leftBtn");
  const filterScroll = document.getElementById("filter-scroll");

  function scrollFilters(offset) {
     filterScroll.scrollBy({ left: offset, behavior: 'smooth' });
    }

    function scrollFiltersRight() {
    scrollFilters(200);
    // Show the left arrow after right scroll
    // leftBtn.style.display = "inline-block";
  }