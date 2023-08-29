import {
    createUserWithEmailAndPassword, auth, db, doc, setDoc, signInWithEmailAndPassword, onAuthStateChanged, signOut, ref,
    uploadBytesResumable, getDownloadURL, storage
} from './firebase.js'


const loader = document.getElementById("loader-div");
const inputs = document.querySelectorAll("input");

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
        if (location.pathname !== "/pages/login.html" && location.pathname !== "/pages/signup.html" && location.pathname !== "/index.html" && location.pathname !== "/pages/user.html") {
            location.href = "login.html"
        }

    }
});


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
    v.addEventListener("click", () => {
        loader.style.display = "grid"
        signOut(auth).then(() => {
            loader.style.display = "none"

        }).catch((error) => {
            loader.style.display = "none"

        });

    })

});
// ======================================================================= /
// ========================== Post Blogs ================================= /
// ======================================================================= /

// const publishBlog = document.getElementById("publishBlog");
// publishBlog && publishBlog.addEventListener("click", () => {
//     const titleInput = document.getElementById("titleInput");
//     const desInput = document.getElementById("desInput");

//     set(ref(database, 'users/' + "hhhhhrrrrrr"), {
//         title: titleInput.value,
//         description: desInput.value
//     });



// });
// ======================================================================= /
// =========================== Add Image ================================= /
// ======================================================================= /




const uploadFile = (file) => {

    const user = auth.currentUser
    console.log("filename", file.name)
    return new Promise((resolve, reject) => {
        const imgRef = ref(storage, `images/${user.uid}`);
        const uploadTask = uploadBytesResumable(imgRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                    console.log(downloadURL)
                });
            }
        );
    })
}
let srrc;

const fileInput = document.querySelectorAll("input[type='file']")[0];
fileInput && fileInput.addEventListener("change", () => {
    loader.style.display = "grid"

    console.log("working", fileInput.files[0])

    uploadFile(fileInput.files[0]).then(async(res) => {
       
        let profileImg = document.getElementById("profileImg");
        profileImg.src = res;
        srrc = res;
        console.log("imgurl", res)
        loader.style.display = "none"

    }).catch((rej) => {
        console.log("reject==>".rej)
        loader.style.display = "none"

    })
});




