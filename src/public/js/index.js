const socket = io();
let userName = null; 

const chatBox = document.getElementById('chatBox');
const messageLogs = document.getElementById('messageLogs');
const userInfo = document.getElementById('userInfo')
const userList = document.getElementById('userList')

socket.on('newMessage',({messages})=>{
    messageLogs.innerHTML = '';
    messages.forEach(message=>{
        messageLogs.innerHTML+=`<br/>${message.time} ${message.userName}: ${message.message}`
    })
})

socket.on('newUser',({userName})=>{
    if(!userName) return; 
    Swal.fire({
        toast:true,
        title:`new User`,
        text: `${userName} just joined the chat`,
        position: 'top-end',
        showConfirmButton:false,
        timer: 2000 
    })



})

socket.on('userList',({userNames})=>{
    userList.innerHTML = userNames.reduce((html, u)=>{
        return `${html}<br/>${u}`
    },'')
})
 
chatBox.addEventListener('keyup',(e)=>{
    if(e.key == 'Enter'){
        socket.emit('chatMessage', {userName: userName, message: e.target.value, time: new Date().toLocaleTimeString()});
        e.target.value = ''
    }
})

function showLogin(){
    Swal.fire({
        title:'some alert',
        text: 'this is some more text',
        allowOutsideClick: true,
        icon: 'warning',
        input:'text',
        showCancelButton:true,
        cancelButtonText: 'cancelar',
        inputValidator: (value)=>{
            if(!value){
                return `We're missing the userName`
            }

            return '';
        }
        
    }).then((result)=>{
        if(!result.isConfirmed){
            showLogin();
            return; 
        }
        
        onSuccess(result.value)
        socket.emit('authenticated',{userName})
    })
}

function onSuccess(userNameStr){
    userName = userNameStr; 
    Swal.fire({
        title:'Logged in!',
        text: `Enjoy the chat, ${userName}!!`
    })

    userInfo.innerHTML = userName;
}


showLogin();