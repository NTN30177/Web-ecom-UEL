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
  const pageSize = req.query.productsPerPage||8; // Số lượng sản phẩm trên mỗi trang
  const keySearch = req.query.keySearch;
  try {
    let products;
    if (slug !== "search") {
      products = await filterProductsBySlug(slug);
    } else {
      products = await Product.find({}).populate({
        path: "variants.color",
        select: "imageColor nameColor",
      });

      if (keySearch && req.query.userId) {
        const userData = await User.findById(req.query.userId);
        const isKeyExist = userData.historySearch.some(
          (existingKey) => existingKey === keySearch
        );
        if (!isKeyExist) {
          userData.historySearch.unshift(keySearch);
          await userData.save();
        }
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
    console.log(paginatedProducts,123456)
    res.json({
      productsByCategory: paginatedProducts,
      slug,
      totalPage,
      totalProducts,
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
          populate: {
            path: "variants.color",
            select: "imageColor nameColor",
          },
        },
      })
      .lean();

    if (type) {
      const allProducts = type.subtypes.flatMap((subtype) => subtype.products);
      return allProducts;
    } else if(slug=='all') {
      const products = await Product.find({})
      .populate({
        path: "variants.color",
        select: "imageColor nameColor",
      }).lean();
      return products;

    }
    else  {
      const subtype = await Subtype.findOne({ slug })
        .populate({ path: "products",
        populate: {
          path: "variants.color",
          select: "imageColor nameColor",
        },
       })
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
    console.log(keySearch)
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(keySearch.toLowerCase()) ||
        product.variants.some((variant) =>
          variant.color.nameColor
            .toLowerCase()
            .includes(keySearch.toLowerCase())
        )
    );
    console.log(filteredProducts, '1236')
  }
  if (color != "undefined" && color.length > 0) {
    const arrayOfColor = color.split(",");
      filteredProducts = filteredProducts.filter((product) =>
        product.variants.some(
          (variant) =>
          arrayOfColor.includes(variant.color._id.toString()) &&
            variant.variantColor.some((vc) => vc.quantity > 0)
        )
      );



  }
  if (size != "undefined" && size.length > 0) {
    const arrayOfSize = size.split(",");
    filteredProducts = filteredProducts.filter((product) =>
      product.variants.some((variant) =>
        variant.variantColor.some(
          (vc) => arrayOfSize.includes(vc.size) && vc.quantity > 0
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
  return { filteredProducts, totalProducts };
};

const sort = (products, { sort }) => {
  try {
    let sortedProducts;
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
  const endIndex = startIndex + parseInt(pageSize);
  const totalPage = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(0, endIndex);
  return { paginatedProducts, totalPage };
};


module.exports = {
  getCategoryProductsPagination,
};
