let checkboxes = document.querySelectorAll('input[name="cartItem"]');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    updateSelectAll();
  });
});
checkHoverAll();

function checkHoverAll() {
  let qtyDiv = document.getElementsByClassName("qtyItem");
  let qtyArray = Array.from(qtyDiv);
  qtyArray.forEach((q) => {
    let parentDiv = q.closest(".cart-item__all");
    let stockProduct = parentDiv.querySelector(".stockP");
    let productValue = parseFloat(q.value);
    let stockValue = parseFloat(stockProduct.value);
    if (stockValue <= productValue) {
      checkQuantityOnStock(parentDiv);
    }
  });
}
function checkHover(e, value) {
  if (e.style.cursor !== "not-allowed") {
    changeQuantity(e, value);
  } else {
    e.preventDefault();
    e.stopPropagation();
  }
}
async function changeQuantity(e, value) {
  let parentDiv = e.closest(".cart-item__all");
  let qtyInputD = parentDiv.querySelector(".qtyItem");
  let currentQty = parseInt(qtyInputD.value);
  let oldQty = qtyInputD.value;
  let newQty = currentQty + value;

  if (newQty < 1) {
    await deleteP(e);
  }

  qtyInputD.value = newQty;
  await changePrice(parentDiv, newQty, oldQty);
  await checkQuantityOnStock(parentDiv);
  await totalQuantityProduct();
}

//Thay đỗi giá khi ấn cộng trừ
function changePrice(parentDiv, qty, oldQty) {
  let salePriceDiv = parentDiv.querySelector(".sale-price");
  let discountDiv = parentDiv.querySelector(".discount-hide");
  let originPriceDiv = parentDiv.querySelector(".origin-price");
  let originPriceDivStr = layChuSoTuChuoi(originPriceDiv.textContent);
  let pPriceOr = (originPriceDivStr / oldQty) * qty;
  salePriceDiv.innerText = formatTienVietNam(
    (pPriceOr * (100 - discountDiv.value)) / 100
  );
  originPriceDiv.innerText = formatTienVietNam(
    (originPriceDivStr / oldQty) * qty
  );
}
function layChuSoTuChuoi(chuoi) {
  let chiChuSo = chuoi.replace(/[^\d]/g, "");
  return parseInt(chiChuSo);
}
function formatTienVietNam(so) {
  const tien = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(so);
  return tien;
}

//Ấn nút xóa, xóa sản phẩm
function deleteP(e) {
  let parentDiv = e.closest(".cart-item__all");
  parentDiv.remove();
  checkCheckbox();
  updateSelectAll();
}
//Kiểm tra số lượng hàng hóa
function checkQuantityOnStock(parentDiv) {
  let qtyInputD = parentDiv.querySelector(".qtyItem");
  let undesiredNotifiedD = parentDiv.querySelector(".undesired-notified");
  let btnIncrease = parentDiv.querySelector(".inc");
  let stock = parentDiv.querySelector(".stockP").value;
  if (stock == 0) {
    changeCheckbox(parentDiv);
    undesiredNotifiedD.innerText = "Hết hàng";
  } else if (parseFloat(qtyInputD.value) >= stock) {
    changeCheckboxHide(parentDiv);
    btnIncrease.style.opacity = "0.3";
    btnIncrease.style.cursor = "not-allowed";
    if (parseFloat(qtyInputD.value) == stock) {
      changeCheckboxShow(parentDiv);
      undesiredNotifiedD.innerText = `Còn hàng ${stock} sản phẩm!`;
    } else {
      undesiredNotifiedD.innerText = "Không đủ số lượng!";
    }
  } else {
    changeCheckboxShow(parentDiv);
    btnIncrease.style.cursor = "pointer";
    btnIncrease.style.opacity = "1";
    undesiredNotifiedD.innerText = "";
  }
  checkCheckbox();
}
//Chuẩn hóa checkbox
function changeCheckboxHide(parentD) {
  let checkbox = parentD.querySelector(".checkboxProduct");
  checkbox.disabled = true;
  checkbox.style.opacity = "0.5";
  checkbox.style.cursor = "block";
  checkbox.disabled = true;
}
function changeCheckboxShow(parentD) {
  let checkbox = parentD.querySelector(".checkboxProduct");
  checkbox.disabled = false;
  checkbox.style.opacity = "1";
  checkbox.disabled = false;
}

async function totalQuantityProduct() {
  let cb = document.querySelectorAll('input[name="cartItem"]');
  let totalQuantityP = 0;
  let totalCostEstimateP = 0;
  let totalDiscountP = 0;
  let totalCostProductP = 0;
  async function processCheckbox(c) {
    let parentDiv = c.closest(".cart-item__all");
    if (c.checked) {
      // Use 'await' inside the asynchronous function
      let itemQuantityDiv = parentDiv.querySelector(".qtyItem");
      let itemCostEstimatePDiv = parentDiv.querySelector(".sale-price");
      let costProductPDiv = parentDiv.querySelector(".origin-price");

      totalQuantityP += parseInt(itemQuantityDiv.value);
      totalCostProductP += layChuSoTuChuoi(costProductPDiv.textContent);
      totalCostEstimateP += layChuSoTuChuoi(itemCostEstimatePDiv.textContent);
      totalDiscountP = totalCostProductP - totalCostEstimateP;
      document.querySelector(".total-product__value").innerText =
        totalQuantityP;
      document.querySelector(".total-after__discount").innerText =
        formatTienVietNam(totalCostEstimateP);
      document.querySelector(".total-discount__value").innerText =
        formatTienVietNam(totalDiscountP);
    } else {
      // document.querySelector(".total-product__value").innerText = 0;
      // document.querySelector(".total-after__discount").innerText = 0;
      // document.querySelector(".total-discount__value").innerText = 0;
    }
    activeSuitableVoucher();
  }
  let count = 0
  for (let c of cb) {
    await processCheckbox(c);
  }
  noCheckbox()
}

function noCheckbox(){
  let cb = document.querySelectorAll('input[name="cartItem"]');
  let count = 0
  for (let c of cb) {
    if(c.checked){
      count+=1
    }
  }
  if(count==0){
    document.querySelector(".total-product__value").innerText = `0đ`;
      document.querySelector(".total-after__discount").innerText = `0đ`;
      document.querySelector(".total-discount__value").innerText = `0đ`;
      activeSuitableVoucher()
      document.querySelector(".product-gift__value").innerText = `0`;



  }


}

async function checkAll(source) {
  let checkboxes = document.querySelectorAll('input[name="cartItem"]');
  for (const cb of checkboxes) {
    cb.checked = source.checked;
    await totalQuantityProduct();
  }
}
function updateSelectAll() {
  let selectAllCheckbox = document.getElementById("checkAll");
  let checkboxes = document.querySelectorAll('input[name="cartItem"]');
  let allChecked = true;
  for (const cb of checkboxes) {
    if (!cb.checked) {
      allChecked = false;
      break;
    }
  }
  selectAllCheckbox.checked = allChecked;
  totalQuantityProduct();
}
function checkCheckbox() {
  const checkboxes = document.querySelectorAll('input[name="cartItem"]');
  const checkAll = document.getElementById("checkAll");
  let anyDisabled = false;
  checkboxes.forEach((checkbox) => {
    if (checkbox.disabled) {
      checkAll.checked = false;
      anyDisabled = true;
    }
  });
  checkAll.disabled = anyDisabled;
}
// Active voucher
// document.addEventListener("click", function (event) {
//   let target = event.target;
//   if (target.classList.contains("overlay")) {
//     handleOverlayClick(target);
//     discountCartInfo();
//   }
// });

function handleOverlayClick(overlay) {
  let parentDivList = overlay.closest(".voucher-list");
  let parentDiv = overlay.closest(".voucher-item");
  let nonVoucherItems = parentDiv.querySelectorAll(".non-active_voucher");
  nonVoucherItems.forEach(function (item) {
    item.classList.remove("non-active_voucher");
  });

  let discountChooseDiv = createDiscountChooseDiv();
  parentDiv.appendChild(discountChooseDiv);
  if (parentDiv === parentDivList.firstChild) {
  } else {
    removeActiveVoucher();
  }
  parentDivList.insertBefore(parentDiv, parentDivList.firstChild);
  overlay.remove();
}

function createDiscountChooseDiv() {
  let discountChooseDiv = document.createElement("div");
  discountChooseDiv.className = "voucher-item__discount-choose";
  discountChooseDiv.innerHTML =
    '<span class="voucher-item__discount-label">Đã chọn</span>';
  return discountChooseDiv;
}

// function activeVoucher() {
//   let overlays = document.querySelectorAll(".overlay");
//   overlays.forEach(function (overlay) {
//     overlay.addEventListener("click", function () {
//       handleOverlayClick(overlay);
//       discountCartInfo()
//     });
//   });
// }

activeSuitableVoucher();


function activeSuitableVoucher() {
  let priceMarks = document.querySelectorAll(".price-mark");
  let totalAfterDiscount = document.querySelector(".total-after__discount");
  let totalAfterDiscountValue = layChuSoTuChuoi(totalAfterDiscount.textContent);
  let value = 0;
  let pMarkDiv;
  let pMarkMaxDiv;
  let pMarkValueMax = 0;
  //Tìm mark voucher lớn nhất
  priceMarks.forEach((pMark) => {
    let pMarkValue = layChuSoTuChuoi(pMark.textContent);
    if (pMarkValue >= pMarkValueMax) {
      pMarkValueMax = pMarkValue;
    }
  });
  //tìm 2 khoảng mark
  priceMarks.forEach((pMark) => {
    let pMarkValue = layChuSoTuChuoi(pMark.textContent);
    if (pMarkValue <= totalAfterDiscountValue && pMarkValue >= value) {
      value = pMarkValue;
      pMarkDiv = pMark;
    } else if (
      pMarkValue > totalAfterDiscountValue &&
      pMarkValue <= pMarkValueMax
    ) {
      pMarkValueMax = pMarkValue;
      pMarkMaxDiv = pMark;
    }
  });
  if (pMarkDiv) {
    let parentDiv = pMarkDiv.closest(".voucher-item");
    let overLay = parentDiv.querySelector(".overlay");
    console.log(overLay, parentDiv)
    if(overLay){
      handleOverlayClick(overLay);
    }
  } else {
    removeActiveVoucher();
  }

  let voucherInfoCard = document.querySelector(".voucher-info__card");
  if (pMarkMaxDiv) {
    let parentMaxDiv = pMarkMaxDiv.closest(".voucher-item");
    let cardID = parentMaxDiv.querySelector(".voucher-item__ID").textContent;
    let voucherInfoID = document.querySelector(".voucher-info__cardID");
    let voucherInfoAddMore = document.querySelector(".voucher-info__add-more");
    let valueAddMore = pMarkValueMax - totalAfterDiscountValue;
    if (valueAddMore == 0) {
      let parentDiv = pMarkDiv.closest(".voucher-item");
      let cardIdChoose =
        parentDiv.querySelector(".voucher-item__ID").textContent;
      voucherInfoCard.innerText = `Bạn đã được áp mã giảm giá ${cardIdChoose} `;
    } else {
      voucherInfoAddMore.innerText = formatTienVietNam(valueAddMore);
    }
    voucherInfoID.innerText = cardID;
  } else {
    voucherInfoCard.innerText = "";
  }
  let voucherCard = document.querySelectorAll(".voucher-item")[0];
  let nonActiveVoucher = voucherCard.querySelector(".non-active_voucher");
  if (!nonActiveVoucher) {
    voucherCard = layChuSoTuChuoi(
      voucherCard.querySelector(".voucher-item__discount").innerText
    );
    let productGiftCart = document.querySelector(".product-gift__value");
    productGiftCart.innerText = `Giảm ${formatTienVietNam(voucherCard)}`;
  }
  freeShip()
}
function freeShip() {
  let totalPriceAfter = document.querySelector(".total-after__discount").textContent
  let voucherCard = document.querySelector(".product-gift__value").textContent
  let addMoreFreeShip =document.querySelector(".add-more__freeship")
  let totalMoney =
    layChuSoTuChuoi(totalPriceAfter) -
    layChuSoTuChuoi(voucherCard);
  let shipFee =document.querySelector(".product-ship__value")
    if(totalMoney>=1000000){
      document.querySelector(".product-ship__value").innerText=`0đ`
    } else{
      addMoreFreeShip.innerText = formatTienVietNam(1000000-totalMoney)
      shipFee.innerText=formatTienVietNam(35000)
    }
    document.querySelector(".product-total__value").innerText =formatTienVietNam(totalMoney + layChuSoTuChuoi(shipFee.textContent))
}

function removeActiveVoucher() {
  let firstVoucherChoose = document.querySelectorAll(".voucher-item")[0];
  let child1 = firstVoucherChoose
    .querySelector(".trans1")
    .classList.add("non-active_voucher");
  let child2 = firstVoucherChoose
    .querySelector(".white")
    .classList.add("non-active_voucher");
  let child3 = firstVoucherChoose
    .querySelector(".voucher-item__right")
    .classList.add("non-active_voucher");
  let voucherItemDiscountChoose = firstVoucherChoose.querySelector(
    ".voucher-item__discount-choose"
  );
  if (voucherItemDiscountChoose) {
    voucherItemDiscountChoose.remove();
  }
  let overlayDiv = document.createElement("div");
  let find = firstVoucherChoose.querySelector(".overlay");
  if (find) {
  } else {
    overlayDiv.className = "overlay";
    overlayDiv.textContent = "Voucher không phù hợp!";
    firstVoucherChoose.insertBefore(overlayDiv, firstVoucherChoose.firstChild);
  }
}
