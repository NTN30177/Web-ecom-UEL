const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem,
} = require("../models/product");


const {
  User
} = require("../models/user");

const x = async (req, res, next) => {
  try {
    console.log(1);
  } catch (err) {
    console.log(2);
  }
};
const getChart1 = async (req, res, next) => {
  try {
    const dataArray = [];
    const chartData = [];
    // Truy vấn danh sách các Type
    const types = await Type.find().populate({
      path: "subtypes",
      populate: {
        path: "products",
        model: "Product",
      },
    });

    // Duyệt qua từng Type
    for (const type of types) {
      const typeObject = {
        name: type.typeName,
        drilldown: type._id,
        y: 0,
      };
      // Duyệt qua từng Subtype trong Type
      for (const subtype of type.subtypes) {
        // Duyệt qua từng Product trong Subtype
        for (const product of subtype.products) {
          // Duyệt qua từng Variant trong Product
          for (const variant of product.variants) {
            for (const variantColor of variant.variantColor) {
              typeObject.y += variantColor.quantity;
            }
          }
        }
      }

      dataArray.push(typeObject);
    }
    for (const type of types) {
      const typeChartData = {
        name: type.typeName,
        id: type._id,
        data: [],
      };

      for (const subtype of type.subtypes) {
        let totalQuantity = 0;

        for (const product of subtype.products) {
          for (const variant of product.variants) {
            for (const variantColor of variant.variantColor) {
              totalQuantity += variantColor.quantity;
            }
          }
        }
        typeChartData.data.push([subtype.subTypeName, totalQuantity]);
      }

      chartData.push(typeChartData);
    }
    const arrX = dataArray;
    const arrDetail = chartData;
    res.json({ arrX, arrDetail });
  } catch (err) {
    console.log(err);
  }
};
const getChartAccount = async (req, res, next) => {
  try{
      console.log(req.query.start, req.query.end)
      const maxDay = req.query.maxDay
      console.log('md'+maxDay)
      // const maxDay = 30
      const arr=[]
      const today = new Date().getDate();
      let startDateThisMonth;
      if(today<maxDay){
          const getDayLastMonth = maxDay - today
          const lastMonth = (new Date().getMonth()).toString().padStart(2, '0');
          const lastDayOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
          const startDateLastMonth =lastDayOfLastMonth-getDayLastMonth
          for(let i = startDateLastMonth; i<=lastDayOfLastMonth;i++){
              const day = i < 10 ? '0' + i : i.toString();
              const key = day + '-' + lastMonth;
                  arr.push({
                      "date": key,
                      "count": 0
                    },)
          }
           startDateThisMonth = 1;
      } else{
           startDateThisMonth = today - maxDay
      }
      const thisMonth =(new Date().getMonth() + 1).toString().padStart(2, '0');
      for(let i = startDateThisMonth; i<=today;i++){
          const day = i < 10 ? '0' + i : i.toString();
          const key = day + '-' + thisMonth;
              arr.push({
                  "date": key,
                  "count": 0
                },)
      }
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - maxDay);
      console.log('sd'+ startDate)
      const accountCountByDay = await User.aggregate([
          {
              $match: {
                createdAt: { $gte: startDate, $lte: endDate }
              }
            },
          {
            $group: {
              _id: {
                $dateToString: { format: '%d-%m', date: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { '_id': 1 }
          }
        ]);
        const formattedData = accountCountByDay.reduce((acc, entry) => {
          acc[entry._id] = entry.count;
          return acc;
        }, {});
        console.log(formattedData)
    
        arr.forEach(item => {
          const count = formattedData[item.date] || 0;
          item.count += count;
        });
    
        const arrX = arr.map(item => item.date);
        const arrY = arr.map(item => item.count);
        console.log(arrX, arrY);
      res.json({arrX, arrY});
  }catch(err){
      console.log(err)
  }
  
}
const getChartYear = async (req, res, next) => {
  try {
    console.log('year')
    const year = new Date().getFullYear();
    const arr = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    console.log(currentYear,currentMonth, year)
    
      if(currentMonth<12){
    for (let i = currentMonth ; i <= 12; i++) {
      const month = i.toString().padStart(2, '0');
      const key = `${month}-${year-1}`;
      arr.push({
        "date": key,
        "count": 0
      });
    }
  }
  for (let i = 1 ; i <= currentMonth; i++) {
      const month = i.toString().padStart(2, '0');
      const key = `${month}-${year}`;
      arr.push({
        "date": key,
        "count": 0
      });
    }
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 12, endDate.getDate());
    console.log(startDate, endDate);
    const accountCountByMonth = await User.aggregate([
      {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
      {
        $group: {
          _id: {
            $dateToString: { format: '%m-%Y', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const formattedData = accountCountByMonth.reduce((acc, entry) => {
      acc[entry._id] = entry.count;
      return acc;
    }, {});
    console.log(formattedData)

    arr.forEach(item => {
      const count = formattedData[item.date] || 0;
      item.count += count;
    });

    const arrX = arr.map(item => item.date);
    const arrY = arr.map(item => item.count);
    console.log(arrX, arrY);

    res.json({ arrX, arrY });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const exportUsers = async (req, res) => {
  try {
      const workbook = new excelJS.Workbook();
      const worksheet = workbook.addWorksheet('My Users');
      worksheet.columns = [
          { header: 'S no.', key: 's_no' },
          { header: 'Name.', key: 'name' },
          { header: 'Email ID', key: 'email' },
          { header: 'Mobile.', key: 'mobile' },
          { header: 'Image', key: 'image' },
          { header: 'Is Verified', key: 'is_verified' },
      ];
      let counter = 1;
      const userData = await User.find({ is_admin: 0 }).lean();
      userData.forEach((user) => {
          user.s_no = counter;
          worksheet.addRow(user);
          counter++;
      });
      worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true };
      });
      res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-disposition', 'attachment; filename=users.xlsx');

      workbook.xlsx.write(res).then(() => {
          res.status(200);
      });
  } catch (err) {
      console.log(err.message);
  }
};

//export user data into pdf
const exportUsersPdf = async (req, res) => {
  try {
      const users = await User.find({ is_admin: 0 }).lean();
      const data = { users };
      const filePathName = path.resolve(
          __dirname,
          '../../resources/views/admin/htmltopdf.ejs',
      );
      const htmlString = fs.readFileSync(filePathName).toString();
      let options = {
          format: 'Letter',
          orientation: 'portrait',
          border: '10mm',
      };
      const ejsData = ejs.render(htmlString, data);
      pdf.create(ejsData, options).toFile('users.pdf', (err, response) => {
          if (err) console.log(err);
          const filepath = path.resolve(__dirname, '../../../users.pdf');
          // D:\OneDrive - uel.edu.vn\hk5\web4\test1\users.pdf
          fs.readFile(filepath, (err, file) => {
              if (err) {
                  console.log(err);
                  return res.status(500).send('Could not download file');
              }
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader(
                  'Content-Disposition',
                  'attachment; filename="users.pdf',
              );
              res.send(file);
          });
      });
  } catch (err) {
      console.log(err.message);
  }
};

module.exports = {
  x,getChart1, getChartAccount, getChartYear, exportUsers, exportUsersPdf
};