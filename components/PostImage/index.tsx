import { Post } from "@prisma/client";
import Image, { ImageLoader } from "next/image";
import React from "react";
import styles from "./Image.module.css";

interface Props {
  post: Post;
  width?: number;
  height?: number;
}

const ytLoader: ImageLoader = (props) => {
  return props.src;
};

const PostImage: React.FC<Props> = (props) => {
  const { post, width = 240, height = 135 } = props;

  return (
    <div className={styles.postImage}>
      {post.imageUrl ? (
        <Image
          loader={ytLoader}
          src={post.imageUrl}
          alt={post.title}
          width={width}
          height={height}
          unoptimized
        />
      ) : (
        <div className={styles.defaultThumbnail} />
      )}
    </div>
  );
};

export default PostImage;
