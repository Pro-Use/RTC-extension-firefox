// For CDN version default
ZoomMtg.setZoomJSLib('https://dmogdx0jrul3u.cloudfront.net/1.7.7/lib', '/av'); 

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const zoomMeeting = document.getElementById("zmmtg-root")

const meetConfig = {
        leaveUrl: 'https://yoursite.com/meetingEnd',
	apiKey: '0VTYn6r1RnKxL00vFPKwMA',
	meetingNumber: '94682890130',
	userName: 'Firstname Lastname',
	userEmail: 'firstname.lastname@yoursite.com', // required for webinar
	passWord: '869574', // if required
	role: 0 // 1 for host; 0 for attendee or webinar
};

ZoomMtg.init({
        leaveUrl: meetConfig.leaveUrl,
        isSupportAV: true,
        success: function() {
                ZoomMtg.join({
                        apiKey: meetConfig.apiKey,
                        meetingNumber: meetConfig.meetingNumber,
                        password: meetConfig.passWord, 
                        error(res) { 
                                console.log(res) ;
                        }
                });		
        }
});