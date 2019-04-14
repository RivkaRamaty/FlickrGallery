import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import { Transform } from 'stream';

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
      flipped : false,
      starred : false
    };

    this.handleFlipImageClick = this.handleFlipImageClick.bind(this);
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

  render() {
    var flipped = this.state.flipped ? ' image-flipped' : '';
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
          <FontAwesome className="image-icon" name="clone" title="clone"/>
          <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
