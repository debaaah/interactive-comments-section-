import { type } from '@testing-library/user-event/dist/type'
import React, {useState, useRef} from 'react'
import { useEffect } from 'react/cjs/react.production.min'
import './sass/style.scss'
//const data = require('./data.json')

const Main = () => {
    const [data, setData] = useState(localStorage.getItem('data')? JSON.parse(localStorage.getItem('data')): require('./data.json'))
    //returns an obj that is id of comment: 'not displayed', 
    //it makes the display of the form under every comment none
    const [displayState, setDisplayState] = useState(
        () => {
            let theState = {}
            data.comments.map(item => {
                theState = {...theState, [item.id]: 'notDisplayed'}
                if (item.replies){
                    item.replies.map(item => {
                        theState = {...theState, [item.id]: 'notDisplayed'}
                        return theState
                    })
                }
                return theState
            })
            return theState
        }
    )
    //returns 'not displayed' for the edit form for of every current user comment
    const [displayStateEdit, setDisplayStateEdit] = useState(
        () => {
            let theState = {}
            data.comments.map(item => {
                theState = {...theState, [item.id]: 'notDisplayed'}
                if (item.replies){
                    item.replies.map(item => {
                        theState = {...theState, [item.id]: 'notDisplayed'}
                        return theState
                    })
                }
                return theState
            })
            return theState
        }
    )
    const [clicked, setClicked] = useState(
        () => {
            let theState = {}
            data.comments.map(item => {
                theState = {...theState, [item.id]: {plus: false, minus: false}}
                if (item.replies){
                    item.replies.map(item => {
                        theState = {...theState,  [item.id]: {plus: false, minus: false}}
                        return theState
                    })
                }
                return theState
            })
            return theState
        }
    )
    //returns an array whose key value pair is the id of the comment made by the 
    //current user and 'displayed' to show that the comment is dissplayed 
    const [divClassName, setDivClassName] = useState(
        () => {
            let theState = {}
            data.comments.map(item => {
                if (item.user.username === data.currentUser.username){
                    theState = {...theState, [item.id]: 'displayed'}
                }
                
                if (item.replies){
                    item.replies.map(item => {
                        if (item.user.username === data.currentUser.username){
                            theState = {...theState, [item.id]: 'displayed'}
                        }
                        return theState
                    })
                }
                return theState
            })
            return theState
        }
    )
    const [latestId, setLatestId] = useState(
        () => {
            let idArray = []
                data.comments.map(item => {
                    idArray = [...idArray, item.id]
                    if (item.replies){
                        item.replies.map(item => {
                            idArray = [...idArray, item.id]
                            return idArray
                        })
                    }
                    return idArray
                })
                return Math.max(...idArray)
            }
    )
    const [activeInput, setActiveInput] = useState({reply: null, edit:null})
    const [inputValue, setInputValue] = useState('')
    const [currentUserInputValue, setCurrentUserInputValue] = useState('')
    const parentUsername = useRef('')
    const currentRepliedUser = useRef('')
    const [deleteId, setDeleteId] = useState(null)
    const [editContent, setEditContent] = useState('') //holds the currently edited value

    //this is form that pops up whenever a user clicks reply, it's display is set to none and it is attached at the botttom of every comment
    const inputBox = (id, repliedUser, parentIndex) => {
        const classname= 'currentUserReply-form form' + id + ' ' + displayState[id]
        return(
            <form className={classname} onSubmit={(e) => {
                e.preventDefault()
                replyForm(id, repliedUser, parentIndex)
            }}>
                <span  ><img src={data.currentUser.image.png} alt='your profile picture'/></span>
                <textarea  rows='3' cols='80'   onChange={settingInputValue} value={inputValue} ></textarea>
                <div></div>
                <input type='submit' value='reply'/>
            </form>
        )
    }
    //it adds or subtracts from the score of the user's comment (doesn't minus on 0?)
    const editScore = (action, id) => {
        data.comments.map((item, index) => {
            if (item.id === id){
                if (action === 'plus'){
                   if(!clicked[id].plus ) {
                        item.score = item.score + 1 
                        if (clicked[id].minus){
                            setClicked({...clicked, [id]:{'plus': false, 'minus': false }})
                        }else{
                            setClicked({...clicked, [id]:{'plus': true, 'minus': false }})
                        }
                    }
                }else if(action === 'minus' && item.score !== 0 ){
                    if(!clicked[id].minus ) {
                        item.score = item.score - 1 
                        if (clicked[id].plus){
                            setClicked({...clicked, [id]:{'plus': false, 'minus': false }})
                        }else{
                            setClicked({...clicked, [id]:{'plus': false, 'minus': true }})
                        }
                    }
                }
            }else if(item.replies){
                item.replies.map((item, index) =>{
                    if(item.id === id){
                        if (action === 'plus'){
                            if(!clicked[id].plus ) {
                                 item.score = item.score + 1 
                                 if (clicked[id].minus){
                                     setClicked({...clicked, [id]:{'plus': false, 'minus': false }})
                                 }else{
                                     setClicked({...clicked, [id]:{'plus': true, 'minus': false }})
                                 }
                             }
                         }else if(action === 'minus' && item.score !== 0 ){
                             if(!clicked[id].minus ) {
                                 item.score = item.score - 1 
                                 if (clicked[id].plus){
                                     setClicked({...clicked, [id]:{'plus': false, 'minus': false }})
                                 }else{
                                     setClicked({...clicked, [id]:{'plus': false, 'minus': true }})
                                 }
                             }
                         }
                    }
                })
            }
        })
    }

     //checks the username, id and content of the sender. performs some actions if the current user is the sender and if the current user is not the sender
     const sentWho = ( username, id = null, content = null ) => {
         
        if(data.currentUser.username === username && id === null){
            return(
                <span className='blue'>you</span>
            )
        }else if (data.currentUser.username === username && id !== null){
            return(
                <div className='edit-area'>
                    <div onClick={() => {
                        setDivClassName({...divClassName, [activeInput.edit]:'displayed'})
                        setDisplayStateEdit( {...displayStateEdit, [activeInput.edit]:'notDisplayed'})
                        setDisplayState({...displayState, [activeInput.reply]:'notDisplayed'})
                        setDeleteId(id)
                        }
                        } 
                        data-toggle="modal" data-target="#modal" className='delete'> 
                        <span><svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg></span>
                        <span>delete</span>
                    </div>
                    <div className='edit' onClick={() => settingDisplayState2(id, 'displayed', content)}> 
                        <span><svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg></span>
                        <span>edit</span>
                    </div>
                </div>
            )              
        }else if (data.currentUser.username !== username && id !== null){
            return(
                <div className='edit-area' onClick={() => settingDisplayState(id, 'displayed', username) }>
                   <div className='reply'>     
                        <span><svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg></span>
                        <span>reply</span>
                    </div>
                </div>
            )
        }else{
            return null
        }
    }
     //checks if the comment was made by the current user, if yes, makes the comment editable else, post the comment
      const sentWho2 = ( username, content, id, x, parents, replyingTo) => {
        if(parentUsername !== ''){
            parentUsername.current = parents
        }
        
       let newContent = content
        let repliedUsername = ''
        const style = {
            visibility: 'hidden', 
            height: '40px',
            width: '100%',
            display: 'block'
        }
        const classname = 'form' + id + ' ' +displayStateEdit[id]
   if (x){      
            repliedUsername = '@' + replyingTo + ' '
            console.log(content.substring(1, (parentUsername.current.length+1)), parentUsername.current)
            
            console.log( replyingTo )
            console.log('else', content.substring(1, (replyingTo.length+1)))
             if (content.substring(1, (parentUsername.current.length+1)) === parentUsername.current){
               newContent = content.substring(parentUsername.current.length+1, content.length+1)
               console.log('new', newContent, 'old', content)
               
            }else  if (content.substring(1, (replyingTo.length+1)) === repliedUsername){
                console.log( replyingTo )
               newContent = content.substring(replyingTo.length+1, content.length+1)
            }
        }
        if (data.currentUser.username === username){
            return(
                <div className='comment'>
                    <div className={divClassName[id]}><span className="blueBold">{repliedUsername}</span>{newContent}<div style={style}></div></div>
                    <form style={{marginBottom: '80px'}} className={classname} onSubmit={(e) => {
                        e.preventDefault()
                        editComment(id)
                    }}>
                        <textarea  rows='4' cols='80' type='text' value={editContent} onChange={settingEditContent}></textarea>
                        <input type='submit' value='update'/>
                        <div ></div>
                    </form>
                </div>
            )              
        }else{
            return(
                <div className={divClassName[id]}><span className="blueBold">{repliedUsername}</span>{newContent}<div style={style}></div></div>
            )
        }
    }
    
    //when comment edit form has been submitted, finds the parent comment being 
    //replied and assigns the new reply to the id of the old reply and sets data
    const editComment = (id) => {
        data.comments.map((item, index) => {
            const parentIndex = index
            if (item.id === id){
                data.comments[index].content = editContent
            }else if(item.replies){
                item.replies.map((item, index) =>{
                    if(item.id === id){
                        data.comments[parentIndex].replies[index].content = editContent
                    }
                })
            }
        })
        setDivClassName({...divClassName, [id]:'displayed'})
        setDisplayStateEdit({...displayStateEdit, [id]: 'notDisplayed'})
    }
     //same as full comment function, the only diffrence is that it doesnt have a reply box
     const reply = (item, parentUsername, parentIndex, index2) => {
         
        let {content, createdAt, id, replyingTo, replies, score, user} = item
      if (/^\d+$/.test(createdAt)){
             createdAt = dateConverter(( Date.now() - createdAt)/1000)
         }
        return(
            <div id={id}>
                {/*comment(content, createdAt, id, score, user, true, parentUsername)*/}
               
            <div className='comment-box'>
                    <div className='score-box-box'>
                        <div className='score-box'>
                            <div onClick={() => editScore('plus', id)} className='plus'><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></div>
                            <div className='score'>{score}</div>
                            <div onClick={() => editScore('minus', id)} className='minus'><svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></div>
                        </div>
                    </div>
                    <div className='content-box'>
                        <div className='details'>
                            <div className='commentator'>
                                <span  ><img src={user.image.png} alt='profile picture'/></span>
                                <span className='username'>{user.username}</span>
                                {sentWho(user.username, null, null)}
                                <span className='time'>{createdAt}</span>
                            </div>
                            {sentWho(user.username, id, content)} 
                        </div>
                        {sentWho2(user.username, content, id, true, parentUsername, replyingTo)}
                    </div>
                </div>
                {replies? replies.map((item, index) => (reply(item, user.username, index2, index))) : null}
                {inputBox(id, user.username, parentIndex)}
            </div>
        )
    }
    //creats an object w the replies and pushes it to the data array.


    //to delete comments
    const deleteComment = (id) => {
        
        data.comments.map((item, index) => {
            const parentIndex = index
            if (item.id === id){
                data.comments.splice(index, 1)
                setData({...data})
            }else if(item.replies){
                item.replies.map((item, index) =>{
                    if(item.id === id){
                        data.comments[parentIndex].replies.splice(index, 1)
                        setData({...data})
                    }
                })
            }
        })
    }
    
    const settingEditContent = (e) => {
        setEditContent(e.target.value)
    } 
   //onclick edit, this function makes the orignal comment not displayed, 
   //
    const settingDisplayState2 = (id, states, content) => {
        setDivClassName({...divClassName, [id]:'notDisplayed'})
        setEditContent(content)
        setDisplayStateEdit({...displayStateEdit, [id]: states})
        setDisplayState({...displayState, [activeInput.reply]: 'notDisplayed'})
        //setDivClassName({...divClassName, [activeInput.reply]: 'displayed'})
        if (activeInput.edit !== id && activeInput.edit !== null){
            setDisplayStateEdit({...displayStateEdit, [id]: states, [activeInput.edit]: 'notDisplayed'})            
        }
        setActiveInput({...activeInput, 'edit': id})
    }
    const settingDisplayState = (id, states, repliedUser) => {
        setDisplayState({...displayState, [id]: states})
        setDisplayStateEdit({...displayStateEdit, [activeInput.edit]: 'notDisplayed'})
        setDivClassName({...divClassName, [activeInput.edit]: 'displayed'})
        
        if (activeInput.reply !== id && activeInput.reply !== null){
            setDisplayState({...displayState, [id]: states, [activeInput.reply]: 'notDisplayed'})
        }
        setActiveInput({...activeInput, 'reply': id}) 
        setInputValue('@' + repliedUser + ' ')
        //parentUsername.current = repliedUser
    }
       const replyForm = (id, repliedUser, parentIndex) => {
        const newInput = {
            content: inputValue,
            createdAt: Date.now(),
            id: latestId + 1,
            replyingTo: repliedUser,
            score: 0,
            user: { 
                image:{
                    "png": "./images/avatars/image-juliusomo.png",
                    "webp": "./images/avatars/image-juliusomo.webp"
            },
                username: data.currentUser.username
            }
        }
        const replyReply = (item) => {
            item.map((index) => {
                    if(parentIndex === index){
                        data.comments[parentIndex].replies.push(newInput)
                    }else if (item.replies ){replyReply(item.replies)}
                })}
        data.comments.map((item, index) => {
            if(parentIndex === index){
                data.comments[parentIndex].replies.push(newInput)
            }else if (item.replies ){replyReply(item.replies)}
        })
        
        setDisplayState({...displayState, [newInput.id]: 'notDisplayed', [id]: 'notDisplayed'})
        setDisplayStateEdit({...displayStateEdit, [newInput.id]: 'notDisplayed', [id]: 'notDisplayed'})
        setLatestId(newInput.id)
        setClicked({... clicked,  [newInput.id]: {plus: false, minus: false}})
        setData({...data})
    }
    const currentUserReplyForm = () =>{
       // const date = dateConverter(( Date.now() - currentDate.current)/1000)
        if (currentUserInputValue){
            const newInput = {
            content: currentUserInputValue,
            createdAt: Date.now(),
            id: latestId + 1,
            replies: [],
            score: 0,
            user: { 
                image:{
                    png: "./images/avatars/image-juliusomo.png",
                    webp: "./images/avatars/image-juliusomo.webp"
            },
                username: data.currentUser.username
            }
        }
        data.comments.push(newInput)
        setDisplayState({...displayState, [newInput.id]: 'notDisplayed'})
        setDisplayStateEdit({...displayStateEdit, [newInput.id]: 'notDisplayed'})
        setCurrentUserInputValue('')
        setClicked({... clicked,  [newInput.id]: {plus: false, minus: false}})
        setLatestId(newInput.id)
    }
    }
    const settingInputValue = (e) => {
        setInputValue(e.target.value)
    }
    const settingcurrentUserInputValue = (e) => {
        setCurrentUserInputValue(e.target.value)
    }
    //converts date to secs mins hour etc
    const dateConverter = (x) => {
        let holder = 0
        if (x < 60){
            return Math.floor( x) + ' secs ago' 
        }else if(x >= 60 && x < 3600 ){
            holder = Math.floor(x/60)
          return holder + ' mins ago' 
        }else if(x >= 3600 && x < 86400 ){
          holder = Math.floor(x/(60*60))
          return holder + ' hours ago' 
        }else if(x >= 86400 && x < 604800 ){
          holder = Math.floor(x/(60*60*24))
          return holder + ' days ago' 
        }else if(x >= 604800 ){
          holder = Math.floor(x/(60*60*24*7))
          return holder + ' weeks ago' 
        }
      }
    localStorage.setItem('data', JSON.stringify(data))
    return(
        <div className='main'>
                {data.comments.map((item, index) => {
                        let {content, createdAt, id, replies, score, user} = item
                        const index1 =index 
                         if (id > 4){
                             createdAt = dateConverter(( Date.now() - createdAt)/1000)
                            }
                        return(
                            <div id={id}>
                             
                            <div className='comment-box'>
                                    <div className='score-box-box'>
                                        <div className='score-box'>
                                            <div onClick={() => editScore('plus', id)} className='plus'><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></div>
                                            <div className='score'>{score}</div>
                                            <div onClick={() => editScore('minus', id)} className='minus'><svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></div>
                                        </div>
                                    </div>
                                    <div className='content-box'>
                                        <div className='details'>
                                            <div className='commentator'>
                                                <span  ><img src={user.image.png} alt='profile picture'/></span>
                                                <span className='username'>{user.username}</span>
                                                {sentWho(user.username)}
                                                <span className='time'>{createdAt}</span>
                                            </div>
                                            {sentWho(user.username, id, content)} 
                                        </div>
                                        {sentWho2(user.username, content, id, false, parentUsername)}
                                    </div>
                                </div>
    
                                <div  className='reply-box'>
                                    {replies? replies.map((item, index) => (reply(item, user.username, index1, index))) : null}
                                </div>
                                {inputBox(id, user.username, index1)}
                            </div>
                        )
                })}
               <div className='currentUser-form-box'> 
                <form className='currentUser-form' onSubmit={(e) => {
                    e.preventDefault()
                    currentUserReplyForm()
                }}>
                    <span ><img src={data.currentUser.image.png} alt='your profile picture'/></span>
                    <textarea rows='4' cols='80' onChange={settingcurrentUserInputValue} value={currentUserInputValue} placeholder='Add a comment'></textarea>
                    <div></div>
                    <input type='submit' value='send'/>
                </form>

            </div>
            <div className="modal fade" id="modal" tabIndex="-1" aria-labelledby="preview of restaurant prompt" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-body">
                            <h4>Delete comment</h4>
                            <div>
                                Are you sure you want to delete this comment? this
                                will remove the comment and can't be undone.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type='button' className='btn close-modal' data-dismiss='modal'>no, cancel</button>
                            <button type='submit' className='btn delet-comment' data-dismiss='modal' onClick={() => deleteComment(deleteId)}> yes, delete</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Main;

//////////////////////////////////////////////////