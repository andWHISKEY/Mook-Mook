/* eslint-disable react/no-array-index-key */
import React from "react";
import Router from "next/router";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { Form } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../pages/styles.module.scss";

class DisplayPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: null,
      movies: null,
      isLoading: true,
      isHome: true,
      type: null,
    };
  }

  componentDidMount() {
    this.postUploading();
  }

  postUploading = async () => {
    const books = [];
    const movies = [];

    await Promise.all(
      ["book", "movie"].map(async (name) => {
        const docs = await this.getPosts(name);
        docs.forEach((doc) => {
          const data = doc.data();
          data.docID = doc.id;
          if (name === "book") books.push(data);
          else if (name === "movie") movies.push(data);
        });
      })
    );
    this.changeLoading(movies, books);
  };

  getPosts = (name) => {
    const { host } = this.props;
    return host
      ? new Promise((resolve, reject) => {
          const data = firebase
            .firestore()
            .collection(name)
            .where("userID", "==", host)
            .get();
          resolve(data);
        })
      : new Promise((resolve, reject) => {
          const data = firebase.firestore().collection(name).get();
          resolve(data);
        });
  };

  changeLoading = (movies, books) => {
    if (books !== [] && movies !== []) {
      this.setState({ movies, books, isLoading: false });
    }
  };

  displayPosts = (props) => {
    const { type, movies, books } = props;
    if (movies || books) {
      return type
        ? books.map((book, index) => (
            // eslint-disable-next-line react/button-has-type
            <button
              key={index}
              onClick={() => Router.push(`/post/book_${book.docID}`)}
            >
              {/* --------------------------- */}

              {/* --------------------------- */}
              <div className="small-4 columns">
                <div
                  className={styles.cardcontainer}
                  ontouchstart="this.classList.toggle('hover');"
                >
                  <div className={styles.card}>
                    <div className={styles.front}>
                      <img
                        key={index}
                        width="200px"
                        height="150px"
                        src={book.imgurl}
                        alt={book.title}
                      />
                    </div>
                    <div className={styles.back}>
                      <p>
                        제목:{book.title}
                        <br />
                        색상: {book.color}
                        <br />
                        명대사: {book.line}
                        <br />
                        리뷰: {book.review}
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))
        : movies.map((movie, index) => (
            // eslint-disable-next-line react/button-has-type
            <button
              key={index}
              onClick={() => Router.push(`/post/movie_${movie.docID}`)}
            >
              <div className="small-4 columns">
                <div
                  className={styles.cardcontainer}
                  ontouchstart="this.classList.toggle('hover');"
                >
                  <div className={styles.card}>
                    <div className={styles.front}>
                      <img
                        key={index}
                        width="200px"
                        height="150px"
                        src={movie.imgurl}
                        alt={movie.title}
                      />
                    </div>
                    <div className={styles.back}>
                      <p>
                        제목:{movie.title}
                        <br />
                        색상:
                        <div
                          className={styles.colorbox}
                          style={{ backgroundColor: movie.color }}
                        />
                        <br />
                        명대사: {movie.line}
                        <br />
                        리뷰: {movie.review}
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ));
    }
    return "Error";
  };

  checkChange = (type) => this.setState({ type });

  loadingSkeleton = () => {
    return (
      <SkeletonTheme color="#202020" highlightColor="#444">
        <p>
          <Skeleton width={100} duration={3} count={3} />
        </p>
      </SkeletonTheme>
    );
  };

  render() {
    console.log("rendering");
    const { isLoading, type, movies, books } = this.state;

    return (
      <div>
        <Form.Check
          type="radio"
          name="type"
          label="movie"
          onChange={() => this.checkChange(false)}
          defaultChecked
        />
        <Form.Check
          type="radio"
          name="type"
          label="book"
          onChange={() => this.checkChange(true)}
        />
        <div className={styles.container_row}>
          {isLoading
            ? this.loadingSkeleton()
            : this.displayPosts({ type, movies, books })}
        </div>
      </div>
    );
  }
}

export default DisplayPosts;