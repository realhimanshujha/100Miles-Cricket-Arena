/* ==========================================
   HERO ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const badge = document.querySelector(".hero-badge");
    const heading = document.querySelector(".hero h1");
    const paragraph = document.querySelector(".hero p");
    const buttons = document.querySelector(".hero-buttons");
    const stats = document.querySelectorAll(".stat-card");
    const scrollIndicator = document.querySelector(".scroll-indicator");

    /* ==========================
       INITIAL STATE
    ========================== */

    [badge, heading, paragraph, buttons].forEach(element => {

        if(!element) return;

        element.style.opacity = "0";
        element.style.transform = "translateY(40px)";

    });

    stats.forEach(card => {

        card.style.opacity = "0";
        card.style.transform = "translateY(50px)";

    });

    /* ==========================
       HERO CONTENT
    ========================== */

    setTimeout(() => {

        animateElement(badge,0);

        animateElement(heading,200);

        animateElement(paragraph,400);

        animateElement(buttons,600);

    },100);

    /* ==========================
       STATS
    ========================== */

    stats.forEach((card,index)=>{

        setTimeout(()=>{

            card.style.transition=".7s ease";

            card.style.opacity="1";
            card.style.transform="translateY(0)";

        },900+(index*150));

    });

    /* ==========================
       SCROLL INDICATOR
    ========================== */

    window.addEventListener("scroll",()=>{

        if(window.scrollY>150){

            scrollIndicator.style.opacity="0";

        }else{

            scrollIndicator.style.opacity="1";

        }

    });

});

/* ==========================================
   REUSABLE ANIMATION
========================================== */

function animateElement(element,delay){

    if(!element) return;

    setTimeout(()=>{

        element.style.transition=".8s ease";

        element.style.opacity="1";

        element.style.transform="translateY(0)";

    },delay);

}

/* ==========================================
   VIDEO FALLBACK
========================================== */

const heroVideo=document.querySelector(".hero-video");

if(heroVideo){

    heroVideo.addEventListener("error",()=>{

        heroVideo.style.display="none";

        document.querySelector(".hero").style.background=
        "url('assets/images/hero.jpg') center/cover no-repeat";

    });

}

/* ==========================
   COUNTER
========================== */

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(!entry.isIntersecting) return;

        const counter = entry.target;

        const target = parseFloat(counter.dataset.target);

        let current = 0;

        const increment = target / 60;

        const update = ()=>{

            current += increment;

            if(current >= target){

                if(target === 4.9){

                    counter.innerHTML = "4.9★";

                }else if(target === 99){

                    counter.innerHTML = "99%";

                }else if(target === 5000){

                    counter.innerHTML = "5000+";

                }else{

                    counter.innerHTML = target;

                }

                return;

            }

            if(target === 4.9){

                counter.innerHTML = current.toFixed(1);

            }else{

                counter.innerHTML = Math.floor(current);

            }

            requestAnimationFrame(update);

        };

        update();

        counterObserver.unobserve(counter);

    });

});

counters.forEach(counter=>counterObserver.observe(counter));

/* ==========================================
   SCROLL REVEAL
========================================== */

const observer = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("active");

            observer.unobserve(entry.target);

        }

    });

},

{

    threshold:.15

}

);

document.querySelectorAll(

".reveal,.reveal-left,.reveal-right,.reveal-scale"

).forEach(el=>{

    observer.observe(el);

});