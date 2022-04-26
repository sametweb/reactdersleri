import type { GetServerSideProps, NextPage } from "next";
import styles from "styles/Home.module.css";
import { InferGetServerSidePropsType } from "next";
import { getPosts } from "./api/posts";
import Layout from "components/Layout";
import Image, { ImageLoader } from "next/image";

type ComponentProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ytLoader: ImageLoader = (props) => {
  return props.src;
};

const Home: NextPage<ComponentProps> = (props) => {
  const { posts } = props;

  return (
    <Layout>
      <div className={styles.container}>
        {posts.map((post: any) => {
          return (
            <div key={post.id} className={styles.post}>
              <div className={styles.postImage}>
                {post.imageUrl ? (
                  <Image
                    loader={ytLoader}
                    src={post.imageUrl}
                    alt={post.title}
                    width={160}
                    height={90}
                  />
                ) : (
                  <div className={styles.defaultThumbnail} />
                )}
              </div>
              <h2 className={styles.title}>{post.title}</h2>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await getPosts();

  return {
    props: {
      posts: posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toLocaleString(),
        updatedAt: post.updatedAt.toLocaleString(),
      })),
    },
  };
};

export default Home;
