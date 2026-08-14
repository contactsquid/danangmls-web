import type { Lang } from './translations';
import type { ValidationCode } from './listingSubmit';

/**
 * Copy for the add-listing form, in both languages.
 *
 * Vietnamese is the primary audience here — near enough all Da Nang agents are
 * Vietnamese with very little English (Blake, 2026-08-13), and this is the
 * screen they have to get through to contribute anything.
 */

export interface ListingFormCopy {
  pageTitle: string;
  pageSubtitle: string;
  // Sections
  dealType: string;
  forRent: string;
  forSale: string;
  propertyDetails: string;
  propertyType: string;
  district: string;
  neighborhood: string;
  neighborhoodAny: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  areaHint: string;
  price: string;
  priceHintRent: string;
  priceHintSale: string;
  title: string;
  titleHint: string;
  description: string;
  descriptionHint: string;
  photos: string;
  photosHint: string;
  submit: string;
  submitting: string;
  choose: string;
  optional: string;
  // Result
  successTitle: string;
  successBody: (url: string) => string;
  successDelay: string;
  addAnother: string;
  viewProfile: string;
  // Gates
  mustSignIn: string;
  needsName: string;
  notConfigured: string;
  uploadFailed: string;
  sheetFailed: string;
  errors: Record<ValidationCode, string>;
}

export const LISTING_FORM_COPY: Record<Lang, ListingFormCopy> = {
  en: {
    pageTitle: 'Add a listing',
    pageSubtitle: 'Your listing goes live on DanangMLS under your agent profile.',
    dealType: 'This property is',
    forRent: 'For rent',
    forSale: 'For sale',
    propertyDetails: 'Property details',
    propertyType: 'Property type',
    district: 'District',
    neighborhood: 'Neighbourhood',
    neighborhoodAny: 'Not specified',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    area: 'Area',
    areaHint: 'Square metres',
    price: 'Price',
    priceHintRent: 'Monthly rent',
    priceHintSale: 'Total sale price',
    title: 'Listing title',
    titleHint: 'Leave blank and we will write one for you.',
    description: 'Description',
    descriptionHint: 'Describe the property, the area, and what is included. Write in English or Vietnamese.',
    photos: 'Photos',
    photosHint: 'At least one photo is required. JPEG, PNG or WebP, up to 5 MB each, 10 photos maximum.',
    submit: 'Publish listing',
    submitting: 'Publishing…',
    choose: 'Choose…',
    optional: 'optional',
    successTitle: 'Your listing is published',
    successBody: url => `It is live at ${url}`,
    successDelay: 'It can take a couple of minutes to appear in search and listing pages while the site refreshes.',
    addAnother: 'Add another listing',
    viewProfile: 'View your profile',
    mustSignIn: 'Please sign in to add a listing.',
    needsName: 'Add your name to your profile before posting a listing.',
    notConfigured: 'Listing submission is not enabled on this site yet.',
    uploadFailed: 'Your photos could not be uploaded. Please try again.',
    sheetFailed: 'Your listing could not be saved. Please try again in a moment.',
    errors: {
      type: 'Please choose a property type.',
      district: 'Please choose a district.',
      price: 'Please enter a price.',
      rentRange: 'That monthly rent looks wrong. Check the amount and the currency.',
      saleRange: 'That sale price looks wrong. Check the amount and the currency.',
      description: 'Please write a longer description (at least 30 characters).',
      photos: 'Please add at least one photo.',
      agentName: 'Your profile needs a name before you can post.',
    },
  },
  vi: {
    pageTitle: 'Đăng tin bất động sản',
    pageSubtitle: 'Tin đăng của bạn sẽ hiển thị trên DanangMLS dưới hồ sơ môi giới của bạn.',
    dealType: 'Bất động sản này',
    forRent: 'Cho thuê',
    forSale: 'Bán',
    propertyDetails: 'Thông tin bất động sản',
    propertyType: 'Loại hình',
    district: 'Quận / Huyện',
    neighborhood: 'Phường / Khu vực',
    neighborhoodAny: 'Không xác định',
    bedrooms: 'Phòng ngủ',
    bathrooms: 'Phòng tắm',
    area: 'Diện tích',
    areaHint: 'Mét vuông',
    price: 'Giá',
    priceHintRent: 'Giá thuê mỗi tháng',
    priceHintSale: 'Tổng giá bán',
    title: 'Tiêu đề tin đăng',
    titleHint: 'Để trống và chúng tôi sẽ tự tạo tiêu đề cho bạn.',
    description: 'Mô tả',
    descriptionHint: 'Mô tả bất động sản, khu vực xung quanh và những gì đi kèm. Bạn có thể viết bằng tiếng Việt hoặc tiếng Anh.',
    photos: 'Hình ảnh',
    photosHint: 'Cần ít nhất một hình. Định dạng JPEG, PNG hoặc WebP, tối đa 5 MB mỗi hình, tối đa 10 hình.',
    submit: 'Đăng tin',
    submitting: 'Đang đăng…',
    choose: 'Chọn…',
    optional: 'không bắt buộc',
    successTitle: 'Tin đăng của bạn đã được đăng',
    successBody: url => `Tin đang hiển thị tại ${url}`,
    successDelay: 'Có thể mất vài phút để tin xuất hiện trong trang tìm kiếm và danh sách khi trang web cập nhật.',
    addAnother: 'Đăng tin khác',
    viewProfile: 'Xem hồ sơ của bạn',
    mustSignIn: 'Vui lòng đăng nhập để đăng tin.',
    needsName: 'Vui lòng thêm tên vào hồ sơ trước khi đăng tin.',
    notConfigured: 'Chức năng đăng tin chưa được bật trên trang này.',
    uploadFailed: 'Không tải được hình ảnh lên. Vui lòng thử lại.',
    sheetFailed: 'Không lưu được tin đăng. Vui lòng thử lại sau giây lát.',
    errors: {
      type: 'Vui lòng chọn loại hình bất động sản.',
      district: 'Vui lòng chọn quận/huyện.',
      price: 'Vui lòng nhập giá.',
      rentRange: 'Giá thuê này có vẻ không đúng. Vui lòng kiểm tra số tiền và đơn vị tiền tệ.',
      saleRange: 'Giá bán này có vẻ không đúng. Vui lòng kiểm tra số tiền và đơn vị tiền tệ.',
      description: 'Vui lòng viết mô tả dài hơn (ít nhất 30 ký tự).',
      photos: 'Vui lòng thêm ít nhất một hình ảnh.',
      agentName: 'Hồ sơ của bạn cần có tên trước khi đăng tin.',
    },
  },
};

/** Property types, shown with Vietnamese labels but submitted with the English
 *  value the sheet stores (VALID_TYPES in lib/sheets.ts). */
export const TYPE_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    House: 'House', Apartment: 'Apartment', Villa: 'Villa', Land: 'Land',
    Office: 'Office', Retail: 'Retail', Townhouse: 'Townhouse',
    Studio: 'Studio', Shophouse: 'Shophouse',
  },
  vi: {
    House: 'Nhà phố', Apartment: 'Căn hộ', Villa: 'Biệt thự', Land: 'Đất nền',
    Office: 'Văn phòng', Retail: 'Mặt bằng kinh doanh', Townhouse: 'Nhà liền kề',
    Studio: 'Studio', Shophouse: 'Shophouse',
  },
};

export const SUBMITTABLE_TYPES = [
  'House', 'Apartment', 'Villa', 'Land', 'Office', 'Retail', 'Townhouse', 'Studio', 'Shophouse',
] as const;

/** Districts, English value + Vietnamese label. "Da Nang" is deliberately absent:
 *  it is the catch-all the scrapers fall back to, not something an agent posting
 *  a real property should pick. */
export const SUBMITTABLE_DISTRICTS = [
  'Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son',
  'Lien Chieu', 'Cam Le', 'Hoa Vang', 'Hoi An',
] as const;
