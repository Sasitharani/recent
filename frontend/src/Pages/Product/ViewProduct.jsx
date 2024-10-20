import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import axios from "axios";
import { AdminBaseURL } from "../../config/config";
import Swal from "sweetalert2/dist/sweetalert2.js";
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function ProductItems() {
  let [path, setPath] = useState("");
  let [allCheckedId, setAllCheckedId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [orderModal, setOrderModal] = useState(false);
  const [productData, setProductData] = useState([]);
  const [searchProductData, setSearchProductData] = useState({
    catName: "",
    catDesc: "",
    pageNumber: 1,
  });

  const viewProduct = () => {
    let obj = { ...searchProductData };
    obj["pageNumber"] = currentPage;
    axios
      .get(AdminBaseURL + "/product/product-view", { params: obj })
      .then((res) => res.data)
      .then((finalResponse) => {
        //console.log(finalResponse.path)
        if (finalResponse.status === 1) {
          console.log(finalResponse.data)
          setPath(finalResponse.path);
          setProductData(finalResponse.data);
          setTotalPages(finalResponse.totalPages);
        }
      });
  };
/////////////////Works on click of check Box//////////////////////
  let getAllCheckedID = (event) => {
    if (event.target.checked) {
      setAllCheckedId([...allCheckedId, event.target.value]);
    } else {
      let filteredID = allCheckedId.filter((id) => id != event.target.value);
      setAllCheckedId(filteredID);
    }
  };
////////////////Multiple Row Delete/////////////////////////////////
  let multipleRowDelete = () => {
    console.log(allCheckedId.length)
    if (allCheckedId.length == 0) {
      Swal.fire({
        title: "Please select Checkboxes to delete data !",
      });
    } else {
      const swalWithBootstrapButtons = Swal.mixin({
        buttonsStyling: true,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
          confirmButtonColor: "#F90101",
          cancelButtonColor: "#0D0D0D",
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .post(AdminBaseURL + "/product/multiple-delete", {ids: allCheckedId,})
              .then((res) => {
                if (res.data.status == 1) {
                  //console.log(res.data);
                  swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                  });
                  viewProduct();
                }
              })
              .catch((error) => {
                swalWithBootstrapButtons.fire({
                  title: "Error!",
                  text: "An server error occurred !",
                  icon: "error",
                });
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "Your file is safe :)",
              icon: "error",
            });
          }
        });
    }
  };
  ////////////////Single Row Delete/////////////////////////////////
  let singleDelete=(id)=>{
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: true,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        confirmButtonColor: "#F90101",
        cancelButtonColor: "#0D0D0D",
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios.delete(AdminBaseURL + `/product/delete/${id}`).then((res) => {
            if (res.data.status == 1) {
              console.log(res.data);
            }
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            viewProduct();
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error",
          });
        }
      });

  }
///////////////UseEffect to view current Page///////////////////
  useEffect(() => {
    viewProduct();
  }, [currentPage]);
///////////////UseEffect controlled component for checkbox multiple delete///////////////////
  useEffect(() => {
    console.log(allCheckedId);
  }, [allCheckedId]);

  return (
    <section className="w-full">
      {/* Order Modal Start */}
      <div
        id="order-modal"
        className={`${
          orderModal === true ? `block` : `hidden`
        }  block overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div
          className="fixed w-full h-screen "
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div className="relative p-4 px-20 w-full max-w-full max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 className="text-xl font-semibold text-gray-900">
                  Product Image's & Price
                </h3>
                <button
                  onClick={() => setOrderModal(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="order-modal"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <div className="grid grid-cols-[22%_45%_27%] gap-10">
                  <div className="border-2 rounded-md shadow-md p-4">
                    <img
                      src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/13278488/2021/2/11/902af913-69be-4024-b22c-cd573b7dd13b1613028902744-Roadster-Men-Tshirts-9521613028900435-1.jpg"
                      alt=""
                    />
                  </div>
                  <div className="flex items-start flex-wrap gap-5 border-2 rounded-md shadow-md p-3">
                    <img
                      className="w-36"
                      src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/13278488/2021/2/11/7f8383cc-07f5-4714-b451-fba7d49776921613028902727-Roadster-Men-Tshirts-9521613028900435-2.jpg"
                      alt=""
                    />
                    <img
                      className="w-36"
                      src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/13278488/2021/2/11/5d8249b2-cbfa-42a3-9b8a-9406fcb8af0c1613028902710-Roadster-Men-Tshirts-9521613028900435-3.jpg"
                      alt=""
                    />
                    <img
                      className="w-36"
                      src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/13278488/2021/2/11/bf9e30b3-5b8e-4cf1-811b-81ea64d45ed81613028902692-Roadster-Men-Tshirts-9521613028900435-4.jpg"
                      alt=""
                    />
                    <img
                      className="w-36"
                      src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/13278488/2021/2/11/77451543-64cb-4294-8f82-24ac1d78dcf01613028902666-Roadster-Men-Tshirts-9521613028900435-5.jpg"
                      alt=""
                    />
                  </div>
                  <div className="border-2 rounded-md shadow-md p-3">
                    <h3 className="text-center font-semibold text-[20px]">
                      Product Details
                    </h3>
                    <ul className="space-y-4 mt-8">
                      <li className="font-semibold text-[17px]">
                        Price :{" "}
                        <span className="font-normal text-[16px] ">
                            ₹ 1500
                        </span>{" "}
                      </li>
                      <li className="font-semibold text-[17px]">
                        MRP :{" "}
                        <span className="font-normal text-[16px] ">
                            ₹ 3000
                        </span>{" "}
                      </li>
                      <li className="font-semibold text-[17px]">
                        Manage Stock :{" "}
                        <span className="font-normal text-[16px] ">
                            In Stock
                        </span>{" "}
                      </li>
                      <li className="font-semibold text-[17px]">
                        Brand Name:{" "}
                        <span className="font-normal text-[16px] ">
                            Lev's
                        </span>{" "}
                      </li>
                      <li className="font-semibold text-[17px]">
                        Size :{" "}
                        <span className="font-normal text-[16px] ">  Xl </span>{" "}
                      </li>
                      <li className="font-semibold text-[17px]">
                        Color :{" "}
                        <span className="font-normal text-[16px] ">  Red </span>{" "}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Order Modal End */}

      <Breadcrumb path={"Product"} path2={"Product Items"} slash={"/"} />

      <div className="w-full min-h-[610px]">
        <form>
          <div className="max-w-[1220px] mx-auto py-5">
            <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
              Product Items
            </h3>
            <div className="border border-t-0 rounded-b-md border-slate-400">
              <div className="relative overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-gray-500">
                  <thead className="text-sm text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        <button
                          type="button"
                          onClick={multipleRowDelete}
                          className="text-black bg-gradient-to-br from-red-600 to-white-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-black-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                          Delete
                        </button>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Product Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Short Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Thumbnails
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <input
                            name="deleteCheck"
                            id="purple-checkbox"
                            type="checkbox"
                            onChange={getAllCheckedID}
                            value={product._id}
                            checked={
                              allCheckedId.includes(product._id) ? true : ""
                            }
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 "
                          />
                        </td>
                        <td className="px-10 py-4">{product.productName}</td>
                        <td className="px-10 py-4">{product.productDes}</td>
                        <td className="px-10 py-4">    <img
                            className="w-16 h-16 rounded-md object-cover object-top"
                            src={path + product.productImage}
                            alt={product.productName}
                          /></td>
                        <td className="px-10 py-4">
                          {product.productShortDes}
                        </td>
                        <td className="px-10 py-4">
                          {product.subCategoryName}
                        </td>
                        
                        <td className="px-10 py-4  flex space-x-4">
                          <i className="fas fa-trash-alt" onClick={()=>singleDelete(product._id)}></i>
                          <i className="fas fa-edit"></i>
                        </td>

                        <td className="px-8 py-4">
                          {product.productStatus ? "Active" : "Deactive"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
