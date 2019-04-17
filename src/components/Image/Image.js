import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      flipped: false,
      starred: false
    };

    this.handleFlipImageClick = this.handleFlipImageClick.bind(this);
    this.handleCloneImageClick = this.handleCloneImageClick.bind(this);
    this.handleFavoriteImageClick = this.handleFavoriteImageClick.bind(this);
    this.handleDeleteImageClick = this.handleDeleteImageClick.bind(this);
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  handleFlipImageClick(e) {
    e.preventDefault();
    this.setState({flipped: !this.state.flipped});
    this.render();
  }

  handleCloneImageClick(e) {
    e.preventDefault();
    this.props.triggerCloneImage(this.props.dto);
  }

  handleFavoriteImageClick(e) {
    e.preventDefault();
    this.setState({starred: !this.state.starred});
    this.render();
    this.props.triggerFavoriteImage(this.props.dto);
  }

  handleDeleteImageClick(e) {
    e.preventDefault();
    this.props.triggerDeleteImage(this.props.dto);
  }

  render() {
    var flipped = this.state.flipped ? ' image-flipped' : '';
    var starred = this.state.starred ? ' image-color' : '';
    return (
      <div
      
        className={"image-root" + flipped}
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
        
        <div className={flipped}>
          <a href="#" onClick={this.handleFlipImageClick}><FontAwesome className="image-icon" name="arrows-alt-h" title="flip"/></a>
          <a href="#" onClick={this.handleCloneImageClick}><FontAwesome className="image-icon" name="clone" title="clone"/></a>
          <a href="#" onClick={this.handleFavoriteImageClick}><FontAwesome className={"image-icon" + starred} name="star" title="favorite"/></a>
          <a href="#" onClick={this.handleDeleteImageClick}><FontAwesome className="image-icon" name="trash-alt" title="delete"/></a>
        </div>
        
      </div>
    );
  }
}

export default Image;
