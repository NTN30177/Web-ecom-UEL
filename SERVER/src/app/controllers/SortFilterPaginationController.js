const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem,
} = require("../models/product");
const { User } = require("../models/user");

const getCategoryProductsPagination = async (req, res) => {
  const slug = req.params.slug;
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10; // Số lượng sản phẩm trên mỗi trang
  const keySearch = req.query.keySearch;
  // console.log(req.session.user_id);
  // console.log(req.query.minPrice);
  console.log(keySearch, "ks");
  try {
    let products;
    if (slug !== "search") {
      products = await filterProductsBySlug(slug);
    } else {
      products = await Product.find({}).populate({
        path: "variants.color",
        model: "Color",
        select: "nameColor",
      }); 
      if (keySearch && req.query.user_id) {
        const userData = await User.findById(req.query.user_id);
        userData.historySearch.unshift(keySearch);
        await userData.save();
      } else {
        console.log("err");
      }
    }
    const { filteredProducts, totalProducts } = filterProducts(
      products,
      req.query
    );
    const { sortedProducts } = sort(filteredProducts, req.query);
    const { paginatedProducts } = paginateProducts(
      sortedProducts,
      page,
      pageSize
    );
    const totalPage = Math.ceil(totalProducts / pageSize);
    // console.log(paginatedProducts)
    res.json({
      productsByCategory: paginatedProducts,
      slug,
      totalPage,
      totalProducts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching category products" });
  }
};

const filterProductsBySlug = async (slug) => {
  try {
    const type = await Type.findOne({ slug })
      .populate({
        path: "subtypes",
        populate: {
          path: "products",
          model: "Product",
        },
      })
      .lean();

    if (type) {
      const allProducts = type.subtypes.flatMap((subtype) => subtype.products);
      return allProducts;
    } else {
      const subtype = await Subtype.findOne({ slug })
        .populate("products")
        .lean();
      if (subtype) {
        return subtype.products;
      } else {
        return [];
      }
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

const filterProducts = (
  products,
  { keySearch, color, size, minPrice, maxPrice }
) => {
  let filteredProducts = [...products];
  let totalProducts = 0; // Khởi tạo biến totalProducts

  if (keySearch) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(keySearch.toLowerCase()) ||
        product.variants.some((variant) =>
          variant.color.nameColor.toLowerCase().includes(keySearch.toLowerCase())
        )
    );
  }

  // Assuming "color" and "size" are arrays containing colors and sizes respectively
  if (color && color.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.variants.some(
        (variant) =>
          color.includes(variant.color.toLowerCase()) &&
          variant.variantColor.some((vc) => vc.quantity > 0)
      )
    );
  }

  if (size && size.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.variants.some((variant) =>
        variant.variantColor.some(
          (vc) => size.includes(vc.size.toLowerCase()) && vc.quantity > 0
        )
      )
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= parseInt(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= parseInt(maxPrice)
    );
  }

  totalProducts = filteredProducts.length;
  console.log("totalproduct:" + totalProducts);
  return { filteredProducts, totalProducts };
};

const sort = (products, { sort }) => {
  try {
    let sortedProducts;
    console.log("sortype:" + sort);
    if (sort === "asc") {
      sortedProducts = products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      sortedProducts = products.sort((a, b) => b.price - a.price);
    } else if (sort === "latest") {
      sortedProducts = products.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      // Nếu sort không hợp lệ, trả về toàn bộ danh sách sản phẩm
      sortedProducts = products;
    }
    return { sortedProducts };
  } catch (err) {
    console.error(err);
  }
};

const paginateProducts = (products, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalPage = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(startIndex, endIndex);
  console.log('totalpage',totalPage);
  return { paginatedProducts, totalPage };
};

module.exports = {
  getCategoryProductsPagination,
};
