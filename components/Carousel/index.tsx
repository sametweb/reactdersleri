import React, { useEffect, useRef, useState } from "react";
import styles from "./Carousel.module.scss";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { Playlist, Post } from "@prisma/client";
import PostImage from "components/PostImage";
import classNames from "classnames";
import Link from "next/link";

interface Props {
  playlist: Playlist;
  posts: Post[];
}

const itemWidth = 240;

const Carousel: React.FC<Props> = (props) => {
  const [arrowsVisible, setArrowsVisible] = useState(false);
  const { posts, playlist } = props;
  const itemsRef = useRef<HTMLDivElement>(null);

  const onArrowClick = (direction: "prev" | "next") => () => {
    if (itemsRef.current) {
      if (direction === "next") itemsRef.current.scrollLeft += itemWidth;
      else itemsRef.current.scrollLeft -= itemWidth;
    }
  };

  useEffect(() => {
    const ref = itemsRef.current;
    const arrowsVisible = ref ? ref.scrollWidth > ref.clientWidth : false;
    setArrowsVisible(arrowsVisible);
  }, []);

  const getArrowStyle = (direction: "left" | "right") =>
    classNames({
      [styles.leftArrow]: direction === "left",
      [styles.rightArrow]: direction === "right",
      [styles.inactiveArrow]: !arrowsVisible,
    });

  return (
    <div className={styles.container}>
      <h3 className={styles.carouselTitle}>{playlist.title}</h3>
      <div className={styles.carousel}>
        <div className={getArrowStyle("left")}>
          <ChevronLeftIcon className="w-5" onClick={onArrowClick("prev")} />
        </div>
        <div ref={itemsRef} className={styles.items}>
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.slug}`} passHref>
              <div className={styles.item}>
                <div className={styles.image}>
                  <PostImage post={post} />
                </div>
                <h4 className={styles.title} title={post.title}>
                  {post.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
        <div className={getArrowStyle("right")} onClick={onArrowClick("next")}>
          <ChevronRightIcon className="w-5" />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
