import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import FontAwesome from 'react-fontawesome';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      showOnlyFavorites: false,
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
  getImages(tag) {
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
          this.setState({images: res.photos.photo});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
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

  favoriteImage(current_dto) {
    if(localStorage.getItem(current_dto.id) != null) {
      localStorage.removeItem(current_dto.id);
    }
    else {
      localStorage.setItem(current_dto.id, JSON.stringify(current_dto));
    }
  }

  
  handleFavoritesClick(e) {
    e.preventDefault();
    this.setState({showOnlyFavorites: !this.state.showOnlyFavorites});
    console.log(this.state.showOnlyFavorites);
    if(this.state.showOnlyFavorites) {
      //console.log("images before copy:");
      //console.log(this.state.images);
      this.state.tempImages = JSON.parse(JSON.stringify(this.state.images));
      this.setState({tempImages: this.state.tempImages});

      console.log("tempImages after copy:");
      console.log(this.state.tempImages);

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
      //console.log("tempImages before copy:");
      //console.log(this.state.tempImages);
      this.state.images = JSON.parse(JSON.stringify(this.state.tempImages));
      this.setState({images: this.state.images});
      console.log("images after copy:");
      console.log(this.state.images);
    }
    /*this.render();*/
  }


  render() {
    var seen = [];
    return (
      <div className="gallery-root">
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
      </div>
    );
  }
}

export default Gallery;
