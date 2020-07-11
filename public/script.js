const socket = io('/');
const videoGallery = document.getElementById('video-gallery');
const myPeer = new Peer('F_hjhwaxnhetigd_-8' , {
    secure:true,
    host: 'friendmeets.herokuapp.com',
    port: 443,
})
const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    addVideoStream(myVideo , stream);

    myPeer.on('call' , call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream' , userVideoStream => {
            addVideoStream(video , userVideoStream);
        })
    })

    socket.on('user-connected' , userId => {
        console.log(`connected${userId}`);
        connectToNewUser(userId, stream);
    })

    socket.on('user-disconnected' , userId => {
        if(peers[userId]) peers[userId].close();
    });

    myPeer.on('open' , id => {
        console.log(id);
        socket.emit('join-room' ,ROOM_ID , id)
    })
})

function connectToNewUser (userId , stream) {
    const call = myPeer.on('call' , stream);
    const video = document.createElement('video');
    call.on('stream' , userVideoStream => {
        addVideoStream(video , userVideoStream);
    });
    call.on('close' , () => {
        video.remove();
    });

    peers[userId] = call;
}

function addVideoStream (video , stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata' , () => {
        video.play()
    })
    videoGallery.append(video);

}
