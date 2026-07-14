function initializeFooter(){

    // ==========================
    // Back To Top
    // ==========================

    const backToTop = document.querySelector(".back-to-top");

    if(backToTop){

        window.addEventListener("scroll",()=>{

            if(window.scrollY>500){

                backToTop.classList.add("show");

            }else{

                backToTop.classList.remove("show");

            }

        });

        backToTop.onclick=()=>{

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        };

    }

    // ==========================
    // Policy Popup
    // ==========================

    const privacyBtn=document.getElementById("privacyBtn");

    const termsBtn=document.getElementById("termsBtn");

    const modal=document.getElementById("policyModal");

    const title=document.getElementById("policyTitle");

    const content=document.getElementById("policyContent");

    const close=document.getElementById("closePolicy");

    const accept=document.getElementById("acceptPolicy");

    if(
        !privacyBtn ||
        !termsBtn ||
        !modal ||
        !title ||
        !content ||
        !close ||
        !accept
    ){

        return;

    }

    const privacyHTML = `
    <h3>1. Information We Collect</h3>
    <p>
    We collect your name, phone number, booking details, loyalty card information,
    membership details and payment status to provide our services.
    </p>

    <h3>2. How We Use Your Information</h3>
    <p>
    Your information is used to manage bookings, memberships, loyalty rewards,
    customer support and service improvements.
    </p>

    <h3>3. Payment Information</h3>
    <p>
    We do not store your UPI PIN, bank credentials or card information.
    Payments are processed only for booking confirmation.
    </p>

    <h3>4. Loyalty Program</h3>
    <p>
    Loyalty points and redeemed coupons are maintained to operate our rewards
    program. Reward coupons are generated automatically and may expire.
    </p>

    <h3>5. Data Security</h3>
    <p>
    We use reasonable administrative and technical measures to protect customer
    information from unauthorized access.
    </p>

    <h3>6. Information Sharing</h3>
    <p>
    We never sell or rent your personal information to third parties unless
    required by law.
    </p>

    <h3>7. Contact</h3>
    <p>
    100Miles Cricket Arena<br>
    Guwahati, Assam<br>
    Email: info@100milesarena.com
    </p>
    `;

    const termsHTML = `
    <h3>1. Booking Policy</h3>
    <p>
    Bookings are confirmed only after successful payment or confirmation from
    100Miles Cricket Arena.
    </p>

    <h3>2. Cancellation & Refund</h3>
    <p>
    All confirmed bookings are final.
    No refunds will be provided for cancellations, missed sessions,
    late arrivals or early departures.
    </p>

    <h3>3. Rescheduling</h3>
    <p>
    Rescheduling requests are subject to slot availability and management approval.
    </p>

    <h3>4. Membership</h3>
    <p>
    Memberships are non-transferable and remain valid only for their purchased
    duration.
    </p>

    <h3>5. Loyalty Rewards</h3>
    <p>
    Reward points have no cash value.
    Only one unused reward coupon may exist per loyalty card.
    Redeemed coupons are valid until their expiry date and can be used only once.
    </p>

    <h3>6. Equipment & Safety</h3>
    <p>
    Players must use equipment responsibly.
    Management is not responsible for injuries resulting from misuse of equipment.
    </p>

    <h3>7. Code of Conduct</h3>
    <p>
    Misconduct, abusive behaviour or intentional damage to property may result
    in cancellation of the booking without refund.
    </p>

    <h3>8. Limitation of Liability</h3>
    <p>
    100Miles Cricket Arena is not responsible for loss, theft or damage of
    personal belongings brought to the premises.
    </p>

    <h3>9. Changes to Terms</h3>
    <p>
    Management reserves the right to modify these Terms & Conditions at any time.
    </p>
    `;

    privacyBtn.onclick=(e)=>{

        e.preventDefault();

        title.textContent="Privacy Policy";

        content.innerHTML=privacyHTML;

        modal.classList.add("show");

    };

    termsBtn.onclick=(e)=>{

        e.preventDefault();

        title.textContent="Terms & Conditions";

        content.innerHTML=termsHTML;

        modal.classList.add("show");

    };

    close.onclick=()=>{

        modal.classList.remove("show");

    };

    accept.onclick=()=>{

        modal.classList.remove("show");

    };

    modal.onclick=(e)=>{

        if(e.target===modal){

            modal.classList.remove("show");

        }

    };

}