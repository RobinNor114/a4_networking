console.log('hello world')

const postsBox =  document.getElementById('posts-box')
const spinnerBox =  document.getElementById('spinner-box')
const loadBtn =  document.getElementById('load-btn')
const endBox =  document.getElementById('end-box')
const postForm =  document.getElementById('post-form')
const title =  document.getElementById('id_title')
const body =  document.getElementById('id_body')
const csrf =  document.getElementsByName('csrfmiddlewaretoken')
const alertBox =  document.getElementById('alert-box')

const url = window.location.href

const addBtn =  document.getElementById('add-btn')
const closeBtn =  [...document.getElementsByClassName('add-modal-close')]
const dropzone =  document.getElementById('my-dropzone')

const getCookie =(name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const deleted = localStorage.getItem('title')
if (deleted){
    handleAlerts('danger', `Deleted "${deleted}"`)
    localStorage.clear()
}

const likeDislikePosts = ()=> {
    const likeDislikeForms = [...document.getElementsByClassName('like-dislike-forms')]
    likeDislikeForms.forEach(form=> form.addEventListener('submit', e=>{
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-dislike-${clickedId}`)

        $.ajax({
            type: 'POST',
            url: "/like-dislike/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId, 
            },
            success: function(response){
                console.log(response)
                clickedBtn.textContent = response.liked ? `Dislike (${response.count})`: `Like (${response.count})`
            },
            error: function(error){
                console.log(error)
            }
        })
    }))
}

let visible = 3

const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}`,
        success: function(response){
            console.log(response) 
            const data = response.data;
            setTimeout(()=>{
                spinnerBox.classList.add('not-visible')
                console.log(data);
                data.forEach(el => {
                postsBox.innerHTML += `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${el.title}</h5>
                            <p class="card-text">${el.body}</p>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-2">
                                    <a href="${url}${el.id}" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col-2">
                                    <form class="like-dislike-forms" data-form-id="${el.id}">
                                        <button href="#" class="btn btn-primary" id="like-dislike-${el.id}">${el.liked ? `Dislike (${el.count})`: `Like (${el.count})`}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            likeDislikePosts()
            }, 100)
            console.log(response.size)
            if (response.size === 0) {
                endBox.textContent = 'No more posts'
            }
            else if (response.size <= visible) {
                loadBtn.classList.add('not-visible')
                endBox.textContent = 'No more posts to load'
            }
        },
        error: function(error){
            console.log(error)
        }
    })
}

loadBtn.addEventListener('click', ()=>{
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()
})

postForm.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value,
        },
        success: function(response){
            console.log(response)
            postsBox.insertAdjacentHTML('afterbegin', `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${response.title}</h5>
                            <p class="card-text">${response.body}</p>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-2">
                                    <a href="#" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col-2">
                                    <form class="like-dislike-forms" data-form-id="${response.id}">
                                        <button href="#" class="btn btn-primary" id="like-dislike-${response.id}">Like (0)</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                `)
            likeDislikePosts() 
            // $('#addPostModal').modal('hide')
            handleAlerts('success', 'Post added!')
             // postForm.reset()

        },
        error:  function(error){
            console.log(error)
            $('#addPostModal').modal('hide')
            handleAlerts('danger', 'Post was not added')
            postForm.reset()
        }
    })
})

addBtn.addEventListener('click', ()=>{
    dropzone.classList.remove('not-visible')
})

closeBtn.forEach(btn=> btn.addEventListener('click', ()=>{
    postForm.reset()
    if (!dropzone.classList.contains('not-visible')) {
        dropzone.classList.add('not-visible')
    }
}))

getData()