"use strict";

var deleteButton = document.querySelector('.content-delete-button');
var editButton = document.querySelector('.content-edit-button');
var viewCount = document.querySelector('.content-view-button p');
var commentCount = document.querySelector('.content-comment-button p');
var commentInput = document.querySelector('.comment-box-content');
var commentSubmitButton = document.querySelector('.comment-box-submit-button');
var commentEditButtons = document.querySelectorAll('.comment-edit-button');
var commentDeleteButtons = document.querySelectorAll('.comment-delete-button');
var commentAuthorContent = document.querySelectorAll('.comment-author-content');
var contentModal = document.querySelector('.content-delete-modal');
const contentModalOpen = document.querySelector('.content-delete-button');
const contentModalCancel = document.querySelector('.content-delete-modal-cancel');
const contentModalConfirm = document.querySelector('.content-delete-modal-confirm')
var commentModal = document.querySelector('.comment-delete-modal');
var commentModalOpens = document.querySelectorAll('.comment-delete-button'); // 수정된 코드(여러 요소)
const commentModalCancel = document.querySelector('.comment-delete-modal-cancel');
const commentModalConfirm = document.querySelector('.comment-delete-modal-confirm')

    //post fetch
document.addEventListener('DOMContentLoaded', () => {
    // URL에서 postId 파라미터 값을 가져옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    // post.json에서 데이터를 불러옵니다.
    fetch('/data/post.json')
        .then(response => response.json())
        .then(data => {
        // postId에 해당하는 게시물 데이터
        const post = data.find(post => post.id == postId);
        if (post) {
            document.querySelector('.content-title').textContent = post.title;
            document.querySelector('.content-author p').textContent = post.nickname;
            document.querySelector('.content-author-date').textContent = post.createtime;
            document.querySelector('.content-paragraph').textContent = post.content;
            document.querySelector('.content-author-img').src = post.profile_image;
            document.querySelector('.content-thumbnail').src = post.image;
            document.querySelector('.content-view-button p:first-child').textContent = formatCount(Number(post.views));
            document.querySelector('.content-comment-button p:first-child').textContent = formatCount(Number(post.comments));
          // 이미지, 조회수, 댓글 수 등도 비슷한 방식으로 채울 수 있습니다.
        }
        })
        .catch(error => console.error('Error loading post data:', error));
        

        fetch('/data/comment.json')
        .then(response => response.json())
        .then(comments => {
            const commentsForPost = comments.filter(comment => comment.postId == postId);
            const commentsContainer = document.querySelector('.comment-footer');
        
            // 기존 게시글 데이터 제거
            while (commentsContainer.firstChild) {
                commentsContainer.removeChild(commentsContainer.firstChild);
            }

            commentsForPost.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment-author-wrapper');
                commentElement.innerHTML = `
                <div class="comment-author">
                    <div class="comment-author-header">
                        <div class="comment-author-profile">
                            <p>${comment.nickname}</p>
                        </div>
                        <div class="comment-author-date">${comment.createtime}</div>
                    </div>
                <div class="comment-author-content">${comment.content}</div>
                </div>
                <div class="comment-button">
                    <button class="comment-edit-button">수정</button>
                    <button class="comment-delete-button">삭제</button>
                </div>
                `;

                commentsContainer.appendChild(commentElement);

                //json댓글 각 댓글 요소가 생성될 때마다 수정 및 삭제 버튼에 대한 이벤트리스너 세팅
                //동적으로 생성된 요소에 이벤트 리스너를 추가하려면, 해당 요소들이 문서에 추가된 이후에 이벤트 리스너를 추가해야 합니다.
                commentElement.querySelector('.comment-edit-button').addEventListener('click', function() {
                    isEditing = true;
                    currentEditingComment = commentElement.querySelector('.comment-author-content');
                    var originalContent = currentEditingComment.textContent;
                    commentInput.value = originalContent;
                    commentSubmitButton.textContent = '댓글 수정';
                    commentSubmitButton.style.backgroundColor = '#7F6AEE';
                });
        
                // 삭제 버튼에 대한 이벤트 리스너 추가
                commentElement.querySelector('.comment-delete-button').addEventListener('click', function() {
                    currentDeletingComment = commentElement;
                    commentModal.style.display = 'block';
                });

            });
        })
        .catch(error => console.log('Error loading comment data:', error));

});



    // 2. 수정 클릭 시 게시글 수정 페이지로 이동
    editButton.addEventListener('click', function() {
        window.location.href = 'modifypost.html'; // 수정 페이지 URL로 변경 필요
    });

    //게시글 삭제 모달
    contentModalOpen.addEventListener('click',function(){
    //display 속성을 block로 변경
        contentModal.style.display = 'block';
    });
    contentModalCancel.addEventListener('click',function(){
    //display 속성을 none으로 변경
        contentModal.style.display = 'none';
    });

    contentModalConfirm.addEventListener('click', function(){
        contentModal.style.display = 'none';
        window.location.href = "checkpostlist.html"
    });

    var currentDeletingComment = null;
    
    // 각 댓글 삭제 버튼에 이벤트 리스너 추가
    // commentModalOpens.forEach(function(button) {
    //     button.addEventListener('click', function() {
    //         currentDeletingComment = button.closest('.comment-author-wrapper');
    //         commentModal.style.display = 'block';
    //     });
        
    // });
    
    commentModalCancel.addEventListener('click',function(){
        //display 속성을 none으로 변경
        commentModal.style.display = 'none';
    });
    
    commentModalConfirm.addEventListener('click', function(){

        if (currentDeletingComment) {
            currentDeletingComment.remove();
            currentDeletingComment = null; // 삭제 후 변수 초기화
        }
        // 모달창 숨기기
        commentModal.style.display = 'none';
        
    });


// 조회수 댓글 k 로 변경
    viewCount.textContent = formatCount(Number(viewCount.textContent));
    commentCount.textContent = formatCount(Number(commentCount.textContent));

    // 4. 댓글 입력 기능
    document.addEventListener('DOMContentLoaded', function(){
        //만약 댓글에 아무것도 입력되어있지 않으면 버튼 비활성화 + 색상변경
        // 댓글에 입력되어있으면 버튼 활성화 + 색상변경
        commentInput.addEventListener('input', function() {
            if(commentInput.value === ''){
                commentSubmitButton.addEventListener('click', function(event){
                    event.preventDefault();
                });
                commentSubmitButton.style.backgroundColor = '#ACA0EB';
            }
            else {
                commentSubmitButton.style.backgroundColor = '#7F6AEE';
                commentSubmitButton.addEventListener('click', function(event){
                    // alert('댓글 등록'); 무한 alert 창이 나오는데 아직 해결 못함.
                    // document.location.reload(true);
                });
            }
        });
    })
    
    // 5. 댓글 수정 기능
    var isEditing = false; // 댓글 수정중인지 여부를 추적하는 변수
    var currentEditingComment = null; // 현재 수정 중인 댓글 요소를 저장하는 변수
    
    // commentEditButtons.forEach(button => {
    //     button.addEventListener('click', function() {
    //         isEditing = true; // 수정 모드로 변경
    //         currentEditingComment = button.closest('.comment-author-wrapper').querySelector('.comment-author-content');
    //         var originalContent = currentEditingComment.textContent;
    
    //         commentInput.value = originalContent;
    //         commentSubmitButton.textContent = '댓글 수정';
    //         commentSubmitButton.style.backgroundColor = '#7F6AEE';
    //     });
    // });
    
    // 댓글 등록/수정 버튼에 대한 이벤트 리스너는 한 번만 설정
    commentSubmitButton.addEventListener('click', function(){
        if (isEditing) {
            // 댓글 수정 로직
            currentEditingComment.textContent = commentInput.value;
            isEditing = false; // 수정 모드 종료
            currentEditingComment = null; // 현재 수정 중인 댓글 요소 초기화
        } else {
            // 댓글 등록 로직
            // 여기에 댓글을 등록하는 코드를 추가
        }
        // 버튼 텍스트와 배경색을 기본 상태로 복원
        commentSubmitButton.textContent = '댓글 등록';
        commentSubmitButton.style.backgroundColor = '#ACA0EB';
    });
    //댓글 수정



    //조회수, 댓글 k 로직
function formatCount(count) {
    if (count >= 100000) {
        return (count / 1000).toFixed(0) + 'k';
    } else if (count >= 10000) {
        return (count / 1000).toFixed(0) + 'k';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(0) + 'k';
    } else {
        return count.toString();
    }
}

