import React from "react";
import { useRef, useState } from "react/cjs/react.production.min";

function One() {
    const [data, setData] = useState(localStorage.getItem('data')? JSON.parse(localStorage.getItem('data')): require('./data.json'))
    

    const fullComment = (item, index) => {
        const {content, createdAt, id, replies, score, user} = item
        return(
            <div id={id}>
                {comment(content, createdAt, id, score, user, false, '')}
                <div  className='reply-box'>
                    {ifReply(replies, user.username, index)}
                </div>
                {inputBox(id, user.username, index)}
            </div>
        )
    }
    return null
    /*
  return (
    <div className="main">
      {data.comments.map((item, index) => fullComment(item, index))}
      <div className="currentUser-form-box">
        <form
          className="currentUser-form"
          onSubmit={(e) => {
            e.preventDefault();
            currentUserReplyForm();
          }}
        >
          <span>
            <img src={data.currentUser.image.png} alt="your profile picture" />
          </span>
          <textarea
            rows="4"
            cols="80"
            onChange={settingcurrentUserInputValue}
            value={currentUserInputValue}
            placeholder="Add a comment"
          ></textarea>
          <div></div>
          <input type="submit" value="send" />
        </form>
      </div>
      <div
        className="modal fade"
        id="modal"
        tabIndex="-1"
        aria-labelledby="preview of restaurant prompt"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <h4>Delete comment</h4>
              <div>
                Are you sure you want to delete this comment? this will remove
                the comment and can't be undone.
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn close-modal"
                data-dismiss="modal"
              >
                no, cancel
              </button>
              <button
                type="submit"
                className="btn delet-comment"
                data-dismiss="modal"
                onClick={() => deleteComment(deleteId)}
              >
                {" "}
                yes, delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );*/
}

export default One;
