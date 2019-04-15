import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import FontAwesome from 'react-fontawesome';
import InfiniteScroll from 'react-infinite-scroll-component';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      showImagesFlag: false,
      tempImages: []
    };

    this.cloneImage = this.cloneImage.bind(this);
    this.favoriteImage = this.favoriteImage.bind(this);
    this.handleFavoritesClick = this.handleFavoritesClick.bind(this);
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag, flag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          if (flag === "images") {
            this.setState({images: res.photos.photo});
          }
          else if (flag === "tempImages") { // This code updates tempImages[] (for being concatenated to images[])
            this.setState({tempImages: res.photos.photo});
          }
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag, "images");
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag, "images");
  }

  cloneImage(current_dto) {
    var currentIndex = (this.state.images.indexOf(current_dto));

    this.state.images.splice(currentIndex, 0, current_dto);
    this.setState({images: this.state.images});
    this.render();
  }

  countOccurrence(seenSet,id){ 
    var count = 0;
    seenSet.forEach(check_id => {
      if(id==check_id){
        count++;
      }
    });

    return count;
  }
  // This function updates local storage according to chosen favorite image
  favoriteImage(current_dto) {
    if(localStorage.getItem(current_dto.id) != null) {
      localStorage.removeItem(current_dto.id);
    }
    else {
      localStorage.setItem(current_dto.id, JSON.stringify(current_dto));
    }
  }
  // This function updates UI according to user's choice (show only favorites)
  handleFavoritesClick(e) {
    e.preventDefault();
    //console.log(this.state.showImagesFlag);
    this.setState({
        showImagesFlag: !this.state.showImagesFlag
      });
    this.render();
    //console.log(this.state.showImagesFlag);
    if(!this.state.showImagesFlag) {
      //console.log("showImagesFlag:" + this.state.showImagesFlag);
      var favorites = [];
      for(var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        value = JSON.parse(value);
        favorites.push(value);
      }
      this.state.images = JSON.parse(JSON.stringify(favorites));
      this.setState({images: this.state.images});
    }
    else {
      this.getImages(this.props.tag, "images");
      this.setState({images: this.state.images});
    }
    this.render();
  }

  // This function gets more images into tempImages[] (same way as getting them into images[]),
  // then, concats new images to images[]
  fetchMoreData = () => {
    //console.log("fetchMoreData: ");
    //console.log(this.state.showImagesFlag);
    if (!this.state.showImagesFlag) {
      this.getImages(this.props.tag, "tempImages");
    
      setTimeout(() => {
        this.setState({
          images: this.state.images.concat(this.state.tempImages)
        });
      }, 1500);
      this.render();
    }
  };

  render() {
    var seen = [];
    return (
      <div className="gallery-root">
      <InfiniteScroll
          dataLength={this.state.images.length}
          next={this.fetchMoreData}
          hasMore={true}
        >
        <div className="gallery-favorites">
          <p>Show only Favorites</p>
          <a href="#" onClick={this.handleFavoritesClick}><FontAwesome className="image-icon" name="star" title="favorite"/></a></div>
        {this.state.images.map(dto => {
          var objectKey = null;
          seen.push(dto.id);
          var idOccurrence = this.countOccurrence(seen,dto.id);
          if(idOccurrence > 0) {
             objectKey = 'image-' + dto.id + "(" + idOccurrence + ")";
          }else{
             objectKey = 'image-' + dto.id;
          }
          return <Image triggerCloneImage={this.cloneImage} triggerFavoriteImage={this.favoriteImage} key={objectKey} dto={dto} galleryWidth={this.state.galleryWidth}/>;
        })}
        </InfiniteScroll>
      </div>
      
    );
  }
}

export default Gallery;
