import {
  addSpecimenTypeApi,
  getSpecimenList,
  getSpecimenTypeApi,
  updateSpecimenTypeApi,
  deleteSpecimenTypeApi,

  addStatusApi,
  getStatusListApi,
  updateStatusApi,
  deleteStatusApi,

  addCategoryApi,
  getCategoryListApi,
  updateCategoryApi,
  deleteCategoryApi,

  addLocationApi,
  getLocationListApi,
  updateLocationApi,
  deleteLocationApi,
  addsalespersonApi,
  getsalespersonListApi,
  updatesalespersonApi,
  deletesalespersonApi
} from "../../api/endpoint";

export const MASTER_CONFIG = {
  specimen: {
    title: "Specimen Type",
    fields: [
      { label: "Specimen Name", key: "name" }
    ],
    api: {
      list: getSpecimenList,
      add: addSpecimenTypeApi,
      update: updateSpecimenTypeApi,
      delete: deleteSpecimenTypeApi,
    },
  },

  status: {
    title: "Status",
    fields: [
      { label: "Status Name", key: "status" }
    ],
    api: {
      list: getStatusListApi,
      add: addStatusApi,
      update: updateStatusApi,
      delete: deleteStatusApi,
    },
  },

  category: {
    title: "Category",
    fields: [
      { label: "Category Name", key: "category" },
      { label: "Business Type", key: "business_type" },
    ],
    api: {
      list: getCategoryListApi,
      add: addCategoryApi,
      update: updateCategoryApi,
      delete: deleteCategoryApi,
    },
  },

  location: {
    title: "Location",
    fields: [
      { label: "Location Name", key: "location" }
    ],
    api: {
      list: getLocationListApi,
      add: addLocationApi,
      update: updateLocationApi,
      delete: deleteLocationApi,
    },
  },

  salesperson: {
    title: "Salesperson",
    fields: [
      { label: "Salesperson Name", key: "name" }
    ],
    api: {
      list: getsalespersonListApi,
      add: addsalespersonApi,
      update: updatesalespersonApi,
      delete: deletesalespersonApi,
    },
  },
};