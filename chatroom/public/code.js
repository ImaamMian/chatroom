(function(){
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    /*
    window.addEventListener('beforeunload', function (e) {
        socket.broadcast.emit("update", username + " left the conversation");
        e.returnValue = "";
    });
    window.onbeforeunload = function () {
        return 'Are you sure you want to leave?';
    }*/


    app.querySelector(".join-screen #join-user").addEventListener("click",function(){
        let username = app.querySelector(".join-screen #username").value;
        if(username.length ==0){
            return;
        }
        if(username.length>40){
            app.querySelector(".join-screen #username").value = ""
            let modal = document.createElement('div');
            modal.innerHTML = `Username must be less than 40 characters long.`;
            modal.style = `
                position: fixed;
                top: 70%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 2rem;
                background-color: #FFF;
                border: 1px solid #000;
                border-radius: 5px;
                box-shadow: 0 0 10px #888;
                z-Index: 9999;
            `;
            document.body.appendChild(modal);
            setTimeout(() => modal.remove(), 5000);
            return;
            //return app.querySelector(".join-screen #longname").innerHTML = "username must be less than 40 characters long";
            //return alert("username must be less than 40 characters long");
        }
        socket.emit("newuser",username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active") 
        app.querySelector(".chat-screen").classList.add("active") 

    });


    app.querySelector(".join-screen #username").addEventListener('keyup', (e) => {
        if(e.key == 'Enter'){
          if(app.querySelector(".join-screen #username").value!=null && app.querySelector(".join-screen #username").value!=""){
            let username = app.querySelector(".join-screen #username").value;
            if(username.length ==0){
                return;
            }
            if(username.length>40){
                app.querySelector(".join-screen #username").value = ""
                let modal = document.createElement('div');
                modal.innerHTML = `Username must be less than 40 characters long.`;
                modal.style = `
                    position: fixed;
                    top: 70%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 2rem;
                    background-color: #FFF;
                    border: 1px solid #000;
                    border-radius: 5px;
                    box-shadow: 0 0 10px #888;
                    z-Index: 9999;
                `;
                document.body.appendChild(modal);
                setTimeout(() => modal.remove(), 5000);
                return;
                //return app.querySelector(".join-screen #longname").innerHTML = "username must be less than 40 characters long";
                //return alert("username must be less than 40 characters long");
            }
            socket.emit("newuser",username);
            uname = username;
            app.querySelector(".join-screen").classList.remove("active") 
            app.querySelector(".chat-screen").classList.add("active")
          }
        }
    })


    /*document.getElementById("message-input").addEventListener('keyup', (e) => {
        if(e.key == 'Enter'){
          if(document.getElementById("message-input").value!=null && document.getElementById("message-input").value!=""){
            let message = app.querySelector(".chat-screen #message-input").value;
            if(message.length ==0){
                return;
            }
            renderMessage("my",{
                username:uname,
                text:message
            });
            socket.emit("chat",{
                username:uname,
                text:message
            })
            document.getElementById("message-input").value = ""
          }
        }
      })*/

    app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length ==0){
            return;
        }
        renderMessage("my",{
            username:uname,
            text:message
        });
        socket.emit("chat",{
            username:uname,
            text:message
        })
        app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector(".chat-screen #message-input").addEventListener('keyup', (e) => {
        if(e.key == 'Enter'){
          if(document.getElementById("message-input").value!=null && document.getElementById("message-input").value!=""){
            let message = app.querySelector(".chat-screen #message-input").value;
            if(message.length ==0){
                return;
            }
            renderMessage("my",{
                username:uname,
                text:message
            });
            socket.emit("chat",{
                username:uname,
                text:message
            })
            app.querySelector(".chat-screen #message-input").value = "";
          }
        }
    })

    app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });


    socket.on("update",function(update){
        renderMessage("update", update)
    })

    socket.on("chat",function(message){
        renderMessage("other", message)
    })

    function renderMessage(type,message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message")
            el.innerHTML = `
                <div>
                    <div class ="name">You</div>
                    <div class ="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el)
        }else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class","message other-message")
            el.innerHTML = `
                <div>
                    <div class = "name">${message.username}</div>
                    <div class = "text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        }else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class","update")
            el.innerText = message;
            messageContainer.appendChild(el)
        }
        //scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
    
})();