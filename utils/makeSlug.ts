import slugify from "slugify";

const makeSlug = (s: string) => {
  return slugify(s, {
    lower: true,
    remove: /[*+~.()'"!:@?]/g,
  });
};

export default makeSlug;
