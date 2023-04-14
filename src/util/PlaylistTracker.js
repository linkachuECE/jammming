import Spotify from "./Spotify"

let PlaylistTracker = {
    playlistID: '',
    originalPlaylist: [],
    deletionList: [],
    additionList: [],
    newName: null,
    
    init(id, playlist){
        this.originalPlaylist = playlist;
        this.playlistID = id;
    },

    delete(track){
        console.log(track);
        if(this.additionList.find(currTrack => currTrack.id == track.id))
            this.additionList = this.additionList.filter(currTrack => currTrack.id !== track.id);
        else if(this.originalPlaylist.find(currTrack => currTrack.id == track.id))
            this.deletionList.push(track);
    },

    add(track){
        console.log(track);
        if(this.deletionList.find(currTrack => currTrack.id == track.id))
            this.deletionList = this.deletionList.filter(currTrack => currTrack.id !== track.id);
        else if(!this.originalPlaylist.find(currTrack => currTrack.id == track.id))
            this.additionList.push(track);
    },

    changeName(newName){
        this.newName = newName;
    },

    executeChanges(){
        console.log(this.originalPlaylist);

        Spotify.addTracks(this.playlistID, this.additionList)
        Spotify.deleteTracks(this.playlistID, this.deletionList);
    },

    clear(){
        this.playlist = [];
        this.deletionList = [];
        this.additionList = [];
        this.newName = null;
    }
}

export default PlaylistTracker;