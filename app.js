$(document).ready( function() {
	$('input').keydown(function(e){
		if(e.which == 13) {
			findArtists($(this).val());
		}
	})
});
//Global variables
var spotifyId = [];
var playlist = [];
var songs =[];

//GETTING THE FIRST ARTIST OF EACH EVENT FROM JAMBASE
function findArtists(tag){
	$.ajax({
		url: 'http://api.jambase.com/events',
		datatype: 'json',
		type: 'GET',
		data: {
			api_key: 'dumscjg8vv8x2t2r3hsu3x2z',
			zipCode: tag,
		},
	success: function(data){
        console.log('success',data);
        for(i=0;i<data.Events.length;i++){
        	var allEvents = data.Events[i].Artists[0].Name;
        	console.log(allEvents);
        	playlist.push(allEvents);
        	console.log(playlist);
       	}
        getId();
    }
    })
}

//TURN THE NAME INTO A SPOTIFY ID
function getId(){
	for(var j = 0;j<11;j++){
	$.ajax({
        url: 'http://developer.echonest.com/api/v4/artist/search',
        datatype: 'json',
       	type:'GET',
       	data:{
       		api_key: 'APRGVYHQGMQ5FKTYM',
       		name: playlist[j],
       		format: 'json',
       		results: '1',
       		bucket: 'id:spotify'
    },
       	success: function(data){
       		console.log('success',data);
       		for(var i=0;i<data.response.artists.length;i++){
       			var id = data.response.artists[i].foreign_ids[0].foreign_id;
       			console.log(id)
       			var splitId = id.split(':');
       			spotifyId.push(splitId[2]);
       			console.log(spotifyId);
       			songCheck();
       		}
       		
    }
    });	
	}
	
}

//COUNTERS TO DETERMINE WHEN CALLBACK IS CALLED
var count = 0;
function songCheck() { // will be called once for each ajax call
  	count++;
  if (count === 10) { // # finished ajax calls = loop size
   getSongs();
  }
}  

var count2 = 0;
function artistCount() { // will be called once for each ajax call
  	count2++;
  if (count2 === 10) { // # finished ajax calls = loop size
   playBands();
  }
}
//GET SONG ID'S
function getSongs(){
	for(var i=0; i<spotifyId.length;i++){
	$.ajax({
		url: 'https://api.spotify.com/v1/artists/'+spotifyId[i]+'/top-tracks',
		datatype: 'json',
		type: 'GET',
		data:{
			country: 'US',
			results: 1
		},
		success: function(data){
			var track = (data.tracks[0].id);
			songs.push(track);
			console.log('success',data);
			console.log(songs);
			artistCount();
		}
	})
	}
	
}
//MAKE A LIST OF BANDS THAT PLAY FROM SPOTIFY
function playBands(){
	for(var i = 0; i<8;i++){
	var frames = ('<iframe class="player" src=https://embed.spotify.com/?uri=spotify:track:'+songs[i]+' width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
	$('#list').append(frames);
}
}








