//needs client side script included in html

let nickname = get_username()

window.onload = () => {
    const socket = io()

    let messages = document.getElementById('messages')
    let message_box = document.getElementById('messageBox')
    let send_btn = document.getElementById('send')
    let color = set_user_color()


    send_btn.addEventListener('click', send_message)
    window.addEventListener('keydown', function(e){
        console.log(e.key)
        if(e.key == 'Enter'){
            send_message()
        }
    })

    window.onclose = () => {
        quit = `User ${nickname} left the chat... `
        socket.emit('chat message', quit)
        window.open(location, '_self').close();
    }

    function send_message(){

        let time = new Date()
        let hour = time.getHours()
        let minutes = time.getMinutes() 
    

        if(parseInt(minutes) < 10){
            minutes = '0' + minutes
        }
        if(parseInt(hour) < 10){
            hour = '0' + hour
        }

        let quit = ''
        let exit = 0
        let changed_nickname
        if(message_box.value.substring(0, 5) == '/nick'){
            message_box.value = message_box.value.slice(5)
            
            prev_nickname = nickname
            nickname = message_box.value
            
            changed_nickname = `\n\n user ${prev_nickname} changed his nick to ${nickname}\n`
            messages.innerHTML += changed_nickname

            message_box.value = '' 
            socket.emit('chat message', changed_nickname)
        }


        let rgb_to_msg
        if(message_box.value.substring(0, 11) == '/color_msg '){
            message_box.value = message_box.value.slice(11)

            // /color_msg [2,34,45]
            let end_arr_index = message_box.value.indexOf(']')
            let rgb = message_box.value.substring(0, end_arr_index + 1)

            message_box.value = message_box.value.slice(end_arr_index + 1)
            console.log(message_box.value)
            rgb = JSON.parse(rgb)
            

            rgb_to_msg = `color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` 
        }

        if(message_box.value.substring(0, 6) == '/color'){
            color = set_user_color()

            message_box.value = ''
        }

        if(message_box.value != '' && message_box.value.trim() != ''){
            if(message_box.value.substring(0, 5) == '/quit'){
                quit = `User ${nickname} left the chat... `
    
            
                message_box.value = message_box.value.slice(5)
                exit = 1
            }

            let message = `\n\n <div>${quit}[${hour}:${minutes}] <@<span style='color:${color}'>${nickname}</span>> <div class='emoji' style='${rgb_to_msg}; display:inline'>${message_box.value}</div></div>`
            messages.innerHTML += message

            console.log($('.comment'))
            console.log( $('.emoji').emoticonize())
            
            $('#emoji').emoticonize()
            $('.comment').emoticonize();
            socket.emit('chat message', message)

            message_box.value = ''

            if(exit == 1){
                window.open(location, '_self').close();
            }

        }
        else{
            message_box.value = ''
        }

        messages.scrollTop += 20
    }

    socket.on('send_to_clients', function(msg){
        messages.innerHTML += `\n\n ${msg}`
        $('.emoji').emoticonize();

        messages.scrollTop += 20
    })
}

function get_username(){
    let nick = prompt('podaj nickname:')
    if (nick.trim() == ''){
        alert('nickname nie może być pusty')
        get_username()
    }
    return nick
}

function set_user_color(){
    let r = Math.floor(Math.random()* (255))
    let g = Math.floor(Math.random()* (255))
    let b = Math.floor(Math.random()* (255))

    return `rgb(${r}, ${g}, ${b})`
}
