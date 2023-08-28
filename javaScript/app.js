import { createUserWithEmailAndPassword, auth, db, doc, setDoc, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase.js'


// ======================================================================= /
// ==========================Statecahnged Function======================== /
// ======================================================================= /
onAuthStateChanged(auth, (user) => {
    if (user) {

        if (location.pathname === "/index.html") {
            let changeHref = document.querySelectorAll('.changeHref');
            changeHref.forEach((value, index) => {
                value.innerHTML = "Dashboard"
                value.href = "pages/home.html"
            })

        }

        const uid = user.uid;
        if (location.pathname !== "/pages/home.html" && location.pathname !== "/pages/user.html" && location.pathname !== "/index.html" && location.pathname !== "/pages/profile.html") {
            location.href = "home.html"
        }
    } else {
        if (location.pathname !== "/pages/login.html" && location.pathname !== "/pages/signup.html"&& location.pathname !== "/index.html"&& location.pathname !== "/pages/user.html") {
            location.href = "login.html"
        }

    }
});


const loader = document.getElementById("loader-div");
const inputs = document.querySelectorAll("input");
// ======================================================================= /
// ==========================Signup Users================================= /
// ======================================================================= /
const signupBtn = document.getElementById("signupBtn");
signupBtn && signupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (inputs[3].value === inputs[4].value) {

        loader.style.display = "grid"
        createUserWithEmailAndPassword(auth, inputs[2].value, inputs[4].value)
            .then(async (userCredential) => {

                const user = userCredential.user;
                console.log(":user===>", user)
                await setDoc(doc(db, "user", user.uid), {
                    FirstName: inputs[0].value,
                    LastName: inputs[1].value,
                    Email: inputs[2].value,
                    Password: inputs[3].value,
                    ConfPassword: inputs[4].value
                });
                loader.style.display = "none"

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                loader.style.display = "none"
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorMessage
                })
            });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Both passwords are different'
        })
    }

});
// ======================================================================= /
// ==========================Login Users================================= /
// ======================================================================= /


const loginBtn = document.getElementById("loginBtn");
loginBtn && loginBtn.addEventListener("click", (e) => {


    e.preventDefault()
    loader.style.display = "grid"


    signInWithEmailAndPassword(auth, inputs[0].value, inputs[1].value)
        .then((userCredential) => {

            const user = userCredential.user;
            console.log(user)
            loader.style.display = "none"

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            loader.style.display = "none"
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage
            })


        });
});

// ======================================================================= /
// ==========================Signup Users================================= /
// ======================================================================= /
const logoutUser = document.querySelectorAll(".logoutUser");

logoutUser && logoutUser.forEach((v, i) => {
    v.addEventListener("click" , ()=>{
        loader.style.display = "grid"
        signOut(auth).then(() => {
            loader.style.display = "none"
            
        }).catch((error) => {
              loader.style.display = "none"
            
          });

    })
    
});
