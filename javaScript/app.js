import {
    createUserWithEmailAndPassword, auth, db, doc, getDoc, setDoc, signInWithEmailAndPassword, onAuthStateChanged, signOut, ref,
    uploadBytesResumable, getDownloadURL, storage, updateDoc, updatePassword, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc
} from './firebase.js'


const loader = document.getElementById("loader-div");
const inputs = document.querySelectorAll("input");
// ======================================================================= /
// =========================== Update Blog =============================== /
// ======================================================================= /
let editBlogID;
const updateBlog = async (id) => {
    loader.style.display = "grid"
    window.scrollTo(0,0)

    console.log(id)
    editBlogID = id;
    let titleInput = document.getElementById("titleInput");
    let desInput = document.getElementById("desInput");
    const publishBlog = document.getElementById("publishBlog");

    const docRef = doc(db, "blogs", id);
    const docSnap = await getDoc(docRef);
    titleInput.value = docSnap.data().title;
    desInput.value = docSnap.data().description;
    publishBlog.innerHTML = "Update BLog"
    loader.style.display = "none"





    console.log(docSnap.data())
}
window.updateBlog = updateBlog;




// ======================================================================= /
// =========================== Delete Blog =============================== /
// ======================================================================= /
const dltBlog = (id) => {
    console.log("is", id)
    Swal.fire(
        'Delete?',
        'You want to delete this blog?',
        'question'
    )
    const swal2confirm = document.getElementsByClassName("swal2-confirm")[0]
    swal2confirm.addEventListener("click", async () => {
        console.log("yahan bhi chal raha")
        await deleteDoc(doc(db, "blogs", id));
        Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Your Blog has deleted',

        })
        console.log("yahan tk cahl raha")
        window.location.reload()
    })
};

window.dltBlog = dltBlog;
// ======================================================================= /
// ====================== Get Specific User Blogs ======================== /
// ======================================================================= /
const getSpUserBlog = async () => {
    loader.style.display = "grid"
    const urlSrch = new URLSearchParams(location.search);
    const user = urlSrch.get('user');
    const q = query(collection(db, "blogs"), where("uid", "==", user));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let heading = document.getElementById("heading");
        heading.innerHTML = `All blogs from ${doc.data().userInfo.FirstName}`

        const allBlogsSpcUser = document.getElementById("allBlogsSpcUser");
        allBlogsSpcUser.innerHTML += `<div class="card col-12 ps-2 mb-4">
        <div class="card-body">
        <div class="d-flex ">
        <img id="blogImage" src="${doc.data().userInfo.Image ? doc.data().userInfo.Image : "../images/profile.png"}" alt="User Profile">
        <div class="ms-3 d-flex flex-column justify-content-center">
        <h5 class="card-title fs-4 col-8">${doc.data().title}</h5>
        <div class="d-flex align-items-center">
        
        <h6 class="card-subtitle p-0 m-0 text-body-secondary">${doc.data().userInfo.FirstName} ${"&nbsp"}</h6> <span
        id="dateInBlog"> -  ${doc.data().time.toDate().toDateString()}</span>
        </div>
        </div>
        </div>
        <p class="card-text mt-3">${doc.data().description}</p>
        </div>
        </div>`
    });

    loader.style.display = "none"


};



// ======================================================================= /
// ========================== Get User Blogs ============================= /
// ======================================================================= /

const getAllBlogs = async () => {
    loader.style.display = "grid"

    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, "------ => ", doc.data());
        let allBlogsHere = document.getElementById("allBlogsHere");

        allBlogsHere.innerHTML += `<div class="card col-12 ps-2 mb-4">
        <div class="card-body">
            <div class="d-flex ">
                <img id="blogImage" src="${doc.data().userInfo.Image ? doc.data().userInfo.Image : "images/profile.png"} " alt="User Profile">
                <div class="ms-3 d-flex flex-column justify-content-center">
                    <h5 class="card-title fs-4 col-8">${doc.data().title}</h5>
                    <div class="d-flex align-items-center">

                        <h6 class="card-subtitle p-0 m-0 text-body-secondary">${doc.data().userInfo.FirstName} ${"&nbsp"} </h6> <span
                            id="dateInBlog"> -   ${doc.data().time.toDate().toDateString()}</span>
                    </div>
                </div>
            </div>
            <p class="card-text mt-3">${doc.data().description}</p>
            <a href="pages/user.html?user=${doc.data().uid}" class="card-link">See all blogs from this user</a>
        </div>
    </div>`
    });
    loader.style.display = "none"

};



// ======================================================================= /
// ========================== Get User Blogs ============================= /
// ======================================================================= /

const getBlogs = async (user) => {
    loader.style.display = "grid"
    const q = query(collection(db, "blogs"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

        // console.log(doc.id, " => ", doc.data().title);
        let blogHere = document.getElementById("blogHere");
        blogHere.innerHTML += ` <div class="card col-12 ps-2 mb-4">
             <div class="card-body">
                 <div class="d-flex ">
                     <img id="blogImage" src="${doc.data().userInfo.Image ? doc.data().userInfo.Image : "../images/profile.png"}" alt="User Profile">
                     <div class="ms-3 d-flex flex-column justify-content-center">
                         <h5 class="card-title fs-4 col-8 col-sm-10">${doc.data().title}</h5>
                         <div class="d-flex align-items-center">
                             <h6 class="card-subtitle p-0 m-0 text-body-secondary">${doc.data().userInfo.FirstName} ${"&nbsp"} </h6>  <span id="dateInBlog"> - ${doc.data().time.toDate().toDateString()}</span>
                         </div>
                     </div>
                 </div>
                 <p class="card-text mt-3">${doc.data().description}</p>
                 <a href="javascript:void(0);" onclick="dltBlog('${doc.id}')" class="card-link">Delete</a>
                 <a href="javascript:void(0);" onclick="updateBlog('${doc.id}')" class="card-link">Edit</a>
             </div>
         </div>`
    });
    loader.style.display = "none"

};

// ======================================================================= /
// ============================== Get Data =============================== /
// ======================================================================= /

const getData = async (user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let profileImg = document.getElementById("profileImg");
        if (location.pathname === "/pages/profile.html") {
            if (docSnap.data().Image) {

                profileImg.src = docSnap.data().Image;

            }
            inputs[1].value = docSnap.data().FirstName;
            inputs[2].value = docSnap.data().Password;
        }
        if (location.pathname === "/pages/home.html") {
            let [a, b] = document.getElementsByClassName('dashboardUserName')
            a.innerHTML = docSnap.data().FirstName;
            b.innerHTML = docSnap.data().FirstName;
        }
    } else {
        console.log("No such document!");
    }
    if (location.pathname === "/index.html") {
        let changeHref = document.querySelectorAll('.changeHref');
        changeHref.forEach((value, index) => {
            value.innerHTML = "Dashboard"
            value.href = "pages/home.html"
        })
    }
    if (location.pathname === "/pages/user.html") {
        let changeHref = document.querySelectorAll('.changeHref');
        changeHref.forEach((value, index) => {
            value.innerHTML = "Dashboard"
            value.href = "/pages/home.html"
        })
    }
}


// ======================================================================= /
// ==========================Signup Users================================= /
// ======================================================================= /
let flag = true;

const signupBtn = document.getElementById("signupBtn");
signupBtn && signupBtn.addEventListener('click', () => {
    flag = false;
    if (inputs[3].value === inputs[4].value) {

        loader.style.display = "grid"
        createUserWithEmailAndPassword(auth, inputs[2].value, inputs[4].value)
            .then(async (userCredential) => {
                try {

                    const user = userCredential.user;
                    console.log(":user===>", user)
                    await setDoc(doc(db, "users", user.uid), {
                        FirstName: inputs[0].value,
                        LastName: inputs[1].value,
                        Email: inputs[2].value,
                        Password: inputs[3].value,
                        ConfPassword: inputs[4].value
                    });
                    loader.style.display = "none"
                    flag = true;
                    location.href = "../index.html"
                } catch (error) {
                    console.log(error, "wwwwwerdjfkds")
                }

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
// ==========================Statecahnged Function======================== /
// ======================================================================= /
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user)
        getData(user)
        if (location.pathname === "/pages/home.html") {
            getBlogs(user)
        }
        else if (location.pathname === "/index.html") {
            getAllBlogs()
        }
        else if (location.pathname === "/pages/user.html") {
            getSpUserBlog()
        }
        const uid = user.uid;

        if (flag && location.pathname !== "/pages/home.html" && location.pathname !== "/pages/user.html" && location.pathname !== "/index.html" && location.pathname !== "/pages/profile.html") {
            location.href = "/pages/home.html"
        }

    } else {
        if (location.pathname === "/index.html") {
            getAllBlogs()
        }
        else if (location.pathname === "/pages/user.html") {
            getSpUserBlog()
        }
        if (location.pathname !== "/pages/login.html" && location.pathname !== "/pages/signup.html" && location.pathname !== "/index.html" && location.pathname !== "/pages/user.html") {
            location.href = "index.html"
        }

    }
});


// ======================================================================= /
// =========================== Add Image ================================= /
// ======================================================================= /


const uploadFile = (file) => {

    const user = auth.currentUser;
    // console.log("filename", file.name)
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

    uploadFile(fileInput.files[0]).then(async (res) => {

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



// ======================================================================= /
// ==========================Update Users================================= /
// ======================================================================= /

let userNameUpdate = document.getElementById('userNameUpdate');
const changeUserName = document.getElementById('changeUserName');
changeUserName && changeUserName.addEventListener('click', () => {
    inputs[1].disabled = false;
});

const updateBtn = document.getElementById('updateBtn');
updateBtn && updateBtn.addEventListener("click", async () => {
    const user = auth.currentUser

    loader.style.display = "grid"
    inputs[1].disabled = true;
    // ================== Update Password ==================//
    let newPassword;
    if (inputs[3].value === inputs[4].value) {
        newPassword = inputs[3].value;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Both passwords are different'
        })
        loader.style.display = "none"

    }

    updatePassword(user, newPassword).then(() => {
        // console.log("password is update")

        loader.style.display = "none"
        Swal.fire({
            icon: 'success',
            title: 'Updated',
            text: 'Your profile is update'
        })
    }).catch((error) => {
        loader.style.display = "none"
        // console.log("password is update", error)

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error
        })
    });


    //===============
    let obj = {
        FirstName: inputs[1].value,
    }
    if (inputs[3].value && inputs[4].value) {
        obj.ConfPassword = inputs[4].value
        obj.Password = inputs[3].value
    }
    if (srrc) {

        obj.Image = srrc
    }
    const updateRef = doc(db, "users", user.uid);
    await updateDoc(updateRef,
        obj
    );


    loader.style.display = "none"
    inputs[3].value = ""
    inputs[4].value = ""
    // console.log("chal gaya reeee")
})


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
            // console.log(user)
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
// ==========================Logout Users================================= /
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

const publishBlog = document.getElementById("publishBlog");
publishBlog && publishBlog.addEventListener("click", async () => {

    let titleInput = document.getElementById("titleInput");
    let desInput = document.getElementById("desInput");
    if (publishBlog.innerHTML === "Publish Blog") {

        if (titleInput.value && desInput.value) {

            loader.style.display = "grid"

            const user = auth.currentUser;
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            const docRef = await addDoc(collection(db, "blogs"), {
                title: titleInput.value,
                description: desInput.value,
                time: serverTimestamp(),
                uid: user.uid,
                userInfo: docSnap.data()
            });
            loader.style.display = "none"
            titleInput.value = ""
            desInput.value = ""
            window.location.reload()
        }
        else (
            Swal.fire({
                icon: 'error',
                title: 'Warning',
                text: 'Please fill both fields!'
            })
        )
    } else {
        if (titleInput.value && desInput.value) {
            loader.style.display = "grid"
            const user = auth.currentUser;
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);


            const updateRef = doc(db, "blogs", editBlogID);
            await updateDoc(updateRef, {
                title: titleInput.value,
                description: desInput.value,
                time: serverTimestamp(),
                uid: user.uid,
                userInfo: docSnap.data()
            });
            loader.style.display = "none"
            titleInput.value = ""
            desInput.value = ""
            publishBlog.innerHTML = "Publish Blog";
            window.location.reload()
            console.log("update ho gaya", editBlogID)
        }
    }
});


