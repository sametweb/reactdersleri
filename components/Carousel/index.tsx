import React from "react";
import styles from "./Carousel.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { Playlist, Post } from "@prisma/client";
import PostImage from "components/PostImage";

interface Props {
  playlist: Playlist;
  posts: Post[];
}

const Carousel: React.FC<Props> = (props) => {
  const { posts, playlist } = props;

  return (
    <div className={styles.container}>
      <h3 className={styles.carouselTitle}>{playlist.title}</h3>
      <div className={styles.carousel}>
        <div className={styles.leftArrow}>
          <ChevronLeftIcon className="w-5" />
        </div>
        <div className={styles.items}>
          {posts.map((post) => (
            <div key={post.id} className={styles.item}>
              <div className={styles.image}>
                <PostImage post={post} />
              </div>
              <h4 className={styles.title} title={post.title}>
                {post.title}
              </h4>
            </div>
          ))}
        </div>
        <div className={styles.rightArrow}>
          <ChevronRightIcon className="w-5" />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
