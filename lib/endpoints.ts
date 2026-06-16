import { API_URL } from "./api"

const prefix = `/api/proxy`

const ENDPOINTS = {
  searchProperties: `${prefix}/properties/search`,
  searchPropertiesBypassProxy: `${API_URL}/properties/search`,
  getFilterData: `${prefix}/properties/distinctTypesAndNeighborhoods`,
  getNeighborhoodsByCity: `${prefix}/properties/neighborhoods-by-city`,
  getMetrics: `${prefix}/property-metrics`,
  registerView: `${prefix}/property-metrics/views`,
  registerShare: `${prefix}/property-metrics/share`,
  registerPropertyAnnouncement: `${prefix}/properties/property-announcements`,
  insertLead: `${prefix}/leads`,
  getBlogPosts: `${prefix}/blog-posts`,
  getBlogPost: (blogPostID: number) => `${prefix}/blog-posts/${blogPostID}`,
} as const

export default ENDPOINTS