/*==========================================
FILTER
==========================================*/

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        document.querySelector(".filter-btn.active")
        .classList.remove("active");

        button.classList.add("active");

        const filter = button.dataset.filter;

        galleryItems.forEach(item=>{

            if(filter==="all" || item.classList.contains(filter)){

                item.style.display="block";

            }

            else{

                item.style.display="none";

            }

        });

    });

});


/*==========================================
LIGHTBOX
==========================================*/

const lightbox=document.getElementById("lightbox");

const lightboxImg=document.getElementById("lightbox-image");

const images=document.querySelectorAll(".gallery-item img");

const closeBtn=document.querySelector(".lightbox-close");

const nextBtn=document.querySelector(".lightbox-next");

const prevBtn=document.querySelector(".lightbox-prev");

let currentIndex=0;

function showImage(index){

    currentIndex=index;

    lightboxImg.src=images[index].src;

    lightbox.classList.add("active");

}

images.forEach((img,index)=>{

    img.addEventListener("click",()=>{

        showImage(index);

    });

});

closeBtn.onclick=()=>{

    lightbox.classList.remove("active");

};

nextBtn.onclick=()=>{

    currentIndex=(currentIndex+1)%images.length;

    showImage(currentIndex);

};

prevBtn.onclick=()=>{

    currentIndex=(currentIndex-1+images.length)%images.length;

    showImage(currentIndex);

};

lightbox.addEventListener("click",(e)=>{

    if(e.target===lightbox){

        lightbox.classList.remove("active");

    }

});

document.addEventListener("keydown",(e)=>{

    if(!lightbox.classList.contains("active")) return;

    if(e.key==="Escape"){

        lightbox.classList.remove("active");

    }

    if(e.key==="ArrowRight"){

        nextBtn.click();

    }

    if(e.key==="ArrowLeft"){

        prevBtn.click();

    }

});