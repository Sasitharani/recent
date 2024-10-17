import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import axios from 'axios'
import { AdminBaseURL } from '../../config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetails() {
  let [sizeData,setSizeData]=useState([])
  let [colorData,setColorData]=useState([])
  let [parentCatData,setParentCatData]=useState([])
  const [galleryPreview, setGalleryPreview] = useState([]);
  let [subCatData,setsubCatData]=useState([])
  let [navigatorStatus, setNavigatorStatus] = useState(false);

  const handleGalleryPreview = (e) => {
    setGalleryPreview(Array.from(e.target.files));
  };

 let getSubcategory=(pid)=>{

  axios.get(AdminBaseURL+`/product/subcategory-view/${pid}`).then((res)=>{
    if(res.data.status){
      console.log(res.data.datalist)
      setsubCatData(res.data.datalist)
    }
  })
 } 

  useEffect(()=>{
    axios.get(AdminBaseURL+"/product/parent-category").then((res)=>{
      if(res.data.status){
        setParentCatData(res.data.datalist)
      }
    })
    
    axios.get(AdminBaseURL+"/product/size-view").then((res)=>{
      if(res.data.status){
        setSizeData(res.data.datalist)
      }
    })

    axios.get(AdminBaseURL+"/product/color-view").then((res)=>{
      if(res.data.status){
        setColorData(res.data.datalist)
      }
    })
  },[])

  let saveProduct=(event)=>{
    event.preventDefault();
    let formDataValue = new FormData(event.target);
    axios.post(AdminBaseURL+"/product/product-insert",formDataValue)
    .then((res)=>{
      
      if(res.data.status){
        console.log(res.data) 
        toast.success("Data Added");
        setNavigatorStatus(true);
      }
    })
    
  }
  let navigator = useNavigate();
  useEffect(() => {
    if (navigatorStatus) {
      setTimeout(() => {
        navigator("/product/product-items");
      }, 2000);
    }
  }, [navigatorStatus]);

  let multipleRowDelete = () => {
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
            .post(AdminBaseURL + "/product/multiple-delete", {
                ids: allCheckedId,
              })
              .then((res) => {
                if (res.data.status == 1) {
                  console.log(res.data);
                  viewCategory();
                  swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                  });
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

  return (
    <section className="w-full">
        <ToastContainer />
        <Breadcrumb
          path={"Product"}
          path2={"Product Details"}
          slash={"/"}
        />
        <div className="w-full min-h-[610px]">
          <div className="max-w-[1220px] mx-auto py-5">
            <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
              Product Details
            </h3>
            <form onSubmit={saveProduct} className="border border-t-0 p-3 rounded-b-md border-slate-400">
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  name='productName'
                  id="base-input"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                  placeholder="Product Name"
                />
              </div>
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Product Description
                </label>
                <textarea name='productDescription' id="message" rows="3" className=" resize-none block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Add Product Description....."></textarea>
              </div>
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Short Description
                </label>
                <textarea name='productShortDescription' id="message" rows="3" className=" resize-none block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Add Product Short Description....."></textarea>
              </div>
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Product Image
                </label>
              
                  <label for="file-input" className="sr-only">
                    Choose file
                  </label>
                  <input
                    type="file"
                    name="pdImg-input"
                    id="file-input"
                    className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
  file:bg-gray-50 file:border-0
  file:me-4
  file:py-3 file:px-4
  "
                  />
               
              </div>
             
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Product Gallery
                </label>
                 <label for="file-input" className="sr-only">
                    Choose file
                  </label>
                  <input
                    type="file"
                    name="pdGalleryImg-input"
                    onChange={handleGalleryPreview}
                    id="file-input"
                    className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
  file:bg-gray-50 file:border-0
  file:me-4
  file:py-3 file:px-4
  " multiple
                  />

          <div className="flex gap-2">
                    {galleryPreview &&
                      galleryPreview.map((imgPre) => (
                        <img src={URL.createObjectURL(imgPre)} className="w-[50px]" />
                      ))}
                  </div>

              </div>
              <div className='mb-5'>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
          <label className="block mb-5 text-md font-medium text-gray-900">Price</label>
          <input
                  type="text"
                  name='pdPrice'
                  id="base-input"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                  placeholder="Product Price"
                />
          </div>
          <div>
          <label className="block mb-5 text-md font-medium text-gray-900">MRP</label>
          <input
                  type="text"
                  name='pdMRP'
                  id="base-input"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                  placeholder="Product MRP"
                />
          </div>
          </div>
            </div>
            <div className="mb-5">
                  <label
                    for="base-input"
                    className="block mb-5 text-md font-medium text-gray-900"
                  >
                    Select Parent Category
                  </label>

                  <select
                    id="default"
                    name='productParentCatId'
                    onChange={(event)=>getSubcategory(event.target.value)}
                    className=" border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option selected>--Select Parent Category--</option>
                    {parentCatData.map((item,index)=>{
                      return <option key={index} value={item._id}>{item.categoryName}</option>
                    })}
                 
                  </select>
                </div>
            <div className="mb-5">
                  <label
                    for="base-input"
                    className="block mb-5 text-md font-medium text-gray-900"
                  >
                    Select Sub Category
                  </label>

                  <select
                    id="default"
                    name='subParentCatSelectBox'
                    className=" border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option selected>--Select Sub Category--</option>
                    {subCatData.map((item,index)=>{
                      return <option key={index} value={item._id}>{item.subCategoryName}</option>
                    })}
                  </select>
                </div>
                <div className='mb-5'>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
          <label className="block mb-5 text-md font-medium text-gray-900">Size</label>
          <select
                    id="default"
                    multiple
                    name='productSizeId[]'
                    className=" border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option selected>--Select Size--</option>
                    {
                      sizeData.map((item,index)=>{
                        return <option key={index} value={item._id}>{item.sizeName}</option>
                      })
                    }
                  </select>
          </div>
          <div>
          <label className="block mb-5 text-md font-medium text-gray-900">Color</label>
          <select
                    id="default"
                    name='productColorId[]'
                    multiple
                    className=" border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option selected>--Select Color--</option>
                    {colorData.map((item,index)=>{
                     return <option key={index} value={item._id}>{item.colorName}</option> 
                    })}
                  </select>
          </div>
          </div>
            </div>
              <div className="pe-5 ps-1">
                <span className="flex items-center gap-3">
                  Status :
                  <input
                    id="link-radio"
                    name='status'
                    type="radio"
                    value="1"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                  ></input>
                  Active
                  <input
                    id="link-radio"
                    name='status'
                    type="radio"
                    value="0"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                  ></input>
                  Deactive
                </span>
              </div>
              <button
                type="submit"
                className="focus:outline-none my-10 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
  </section>
  )
}
