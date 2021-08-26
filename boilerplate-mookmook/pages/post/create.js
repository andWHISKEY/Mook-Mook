/* eslint-disable */
import React from "react";
import firebase from "firebase";
import { Offcanvas, Form, FormGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageCrop from "./crop";
import Search from "./search";

class PostCreatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      imgurl: null,
      titleimg: null,
      type: null,
      colorhue: null,
    };
  }

  initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged();
  }
  sortColors(color) {
    /* Get the hex value without hash symbol. */
    var hex = color.substring(1);

    var r = parseInt(hex.substring(0, 2), 16) / 255;
    var g = parseInt(hex.substring(2, 4), 16) / 255;
    var b = parseInt(hex.substring(4, 6), 16) / 255;
    /* Getting the Max and Min values for Chroma. */
    var max = Math.max.apply(Math, [r, g, b]);
    var min = Math.min.apply(Math, [r, g, b]);

    /* Variables for HSV value of hex color. */
    var chr = max - min;
    var hue = 0;
    var val = max;
    var sat = 0;

    if (val > 0) {
      sat = chr / val;
      if (sat > 0) {
        if (r == max) {
          hue = 60 * ((g - min - (b - min)) / chr);
          if (hue < 0) {
            hue += 360;
          }
        } else if (g == max) {
          hue = 120 + 60 * ((b - min - (r - min)) / chr);
        } else if (b == max) {
          hue = 240 + 60 * ((r - min - (g - min)) / chr);
        }
      }
    }
    /* Sort by Hue. */
    return hue;
  }
  getTime = () => {
    let today = new Date();

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜
    let day = today.getDay(); // 요일
    switch (day) {
      case 0:
        day = "Mon";
        break;
      case 1:
        day = "Tue";
        break;
      case 2:
        day = "Wed";
        break;
      case 3:
        day = "Thu";
        break;
      case 4:
        day = "Fri";
        break;
      case 5:
        day = "Sat";
        break;
      case 6:
        day = "Sun";
        break;
    }
    return year + "/" + month + "/" + date + " " + day;
  };

  handleClick = async (data, icolor) => {
    let title = this.state.title;
    let imgurl = data;
    let titleimg = this.state.titleimg;
    let imgcolor = icolor;
    let type = this.state.type;
    let color = document.getElementById("color").value;
    let line = document.getElementById("line").value;
    let review = document.getElementById("review").value;
    let colorhue = this.sortColors(imgcolor);
    let datetime = this.getTime();

    if (!title || !imgurl || !imgcolor || !type || !color || !line || !review) {
      alert("모든 값을 입력해주세요.");
    } else {
      const db = firebase.firestore();
      const user = firebase.auth().currentUser;
      console.log(user);
      await db
        .collection(type)
        .add({
          displayName: user.displayName,
          userID: user.uid,
          imgcolor: imgcolor,
          type: type,
          title: title,
          imgurl: imgurl,
          titleimg: titleimg,
          color: color,
          colorhue: colorhue,
          line: line,
          review: review,
          uploadTime: datetime,
          likeArray: new Array(),
        })
        .then(() => {
          alert("등록되었습니다.");
          window.location.reload();
        });
    }
  };
  selectTitle = (title, titleimg) => {
    if (title.includes("<b>")) {
      var title = title.replace(/<b>/gi, "").replace(/<\/b>/gi, "");
    }
    this.setState({ title: title, titleimg: titleimg });
  };
  radioChange = (e) => this.setState({ type: e.target.value });
  render() {
    return (
      <Offcanvas show={this.props.show} onHide={this.props.onHide}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Post your review</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="container">
            <Search
              type={this.state.type}
              title={this.state.title}
              selectTitle={this.selectTitle}
            />
            <br />
            <br />
            <Form.Check
              id="type"
              type="radio"
              name="type"
              value="movie"
              label="movie"
              onChange={(e) => this.radioChange(e)}
            />
            <Form.Check
              type="radio"
              name="type"
              id="type"
              value="book"
              label="book"
              onChange={(e) => this.radioChange(e)}
            />
            <Form>
              <Form.Label>Movie Title</Form.Label>
              <Form.Control
                id="title"
                type="text"
                value={this.state.title}
                readOnly
                // placeholder="write the movie title"
              />
              <br></br>
              <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
              <Form.Control
                type="color"
                id="color"
                defaultValue="#563d7c"
                title="Choose your color"
              />
              <FormGroup>
                <Form.Label>Famous line</Form.Label>
                <Form.Control id="line" as="textarea" rows={2} />
              </FormGroup>
              <Form.Group>
                <Form.Label>Review</Form.Label>
                <Form.Control id="review" as="textarea" rows={3} />
              </Form.Group>
            </Form>
            <ImageCrop handleClick={this.handleClick} />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }
}

export default PostCreatePage;
