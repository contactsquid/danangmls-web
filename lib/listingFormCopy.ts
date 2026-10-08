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
  studio: string;
  area: string;
  areaHint: string;
  price: string;
  priceHintRent: string;
  priceHintSale: string;
  minTerm: string;
  minTermHint: string;
  minTermOptions: { value: string; label: string }[];
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
  notYours: string;
  editTitle: string;
  editSubtitle: string;
  saveChanges: string;
  saving: string;
  savedTitle: string;
  myListings: string;
  noListingsYet: string;
  editThis: string;
  photosCurrent: string;
  photoOrderHint: string;
  heroLabel: string;
  heroHint: string;
  removePhoto: string;
  moveEarlier: string;
  moveLater: string;
  addMorePhotos: string;
  backToListings: string;
  errors: Record<ValidationCode, string>;
}

// Only en/vi today — Korean and Russian read through forLang() and fall back to
// English until this copy is translated.
export const LISTING_FORM_COPY: Record<'en' | 'vi', ListingFormCopy> = {
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
    studio: 'Studio',
    area: 'Area',
    areaHint: 'Square metres',
    price: 'Price',
    priceHintRent: 'Monthly rent',
    priceHintSale: 'Total sale price',
    minTerm: 'Minimum term',
    minTermHint: 'The shortest stay you will accept. Quote your monthly rate for a '
      + '1-year term — shorter stays usually cost more.',
    minTermOptions: [
      { value: '1 month',  label: '1-month minimum' },
      { value: '3 months', label: '3-month minimum' },
      { value: '6 months', label: '6-month minimum' },
      { value: '1 year',   label: '1-year minimum' },
    ],
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
    notYours: 'That listing is not one of yours.',
    editTitle: 'Edit listing',
    editSubtitle: 'Changes appear on the site within a few minutes.',
    saveChanges: 'Save changes',
    saving: 'Saving…',
    savedTitle: 'Your changes are saved',
    myListings: 'Your listings',
    noListingsYet: 'You have not posted any listings yet.',
    editThis: 'Edit',
    photosCurrent: 'Current photos',
    photoOrderHint: 'Use the arrows to reorder your photos. The first photo is used on search and listing cards.',
    heroLabel: 'Main photo',
    heroHint: 'The main photo is the one shown first, and the one used on search and listing cards.',
    removePhoto: 'Remove',
    moveEarlier: 'Move earlier',
    moveLater: 'Move later',
    addMorePhotos: 'Add more photos',
    backToListings: 'Back to your listings',
    errors: {
      type: 'Please choose a property type.',
      district: 'Please choose a district.',
      price: 'Please enter a price.',
      rentRange: 'That monthly rent looks wrong. Check the amount and the currency.',
      saleRange: 'That sale price looks wrong. Check the amount and the currency.',
      description: 'Please write a longer description (at least 30 characters).',
      photos: 'Please add at least one photo.',
      agentName: 'Your profile needs a name before you can post.',
      bedrooms: 'Please choose the number of bedrooms.',
      bathrooms: 'Please choose the number of bathrooms.',
    },
  },
  vi: {
    pageTitle: 'Đăng tin bất động sản',
    pageSubtitle: 'Tin đăng sẽ hiển thị trên DanangMLS, gắn với hồ sơ môi giới của anh/chị.',
    dealType: 'Hình thức',
    forRent: 'Cho thuê',
    forSale: 'Cần bán',
    propertyDetails: 'Thông tin bất động sản',
    propertyType: 'Loại hình',
    district: 'Quận / Huyện',
    neighborhood: 'Phường / Khu vực',
    neighborhoodAny: 'Không rõ',
    bedrooms: 'Phòng ngủ',
    bathrooms: 'Phòng tắm',
    studio: 'Studio',
    area: 'Diện tích',
    areaHint: 'm²',
    price: 'Giá',
    priceHintRent: 'Giá thuê/tháng',
    priceHintSale: 'Tổng giá bán',
    minTerm: 'Thời hạn thuê tối thiểu',
    minTermHint: 'Thời gian thuê ngắn nhất anh/chị nhận. Vui lòng ghi giá thuê tháng theo hợp đồng '
      + '1 năm — thuê ngắn hạn thường có giá cao hơn.',
    minTermOptions: [
      { value: '1 month',  label: 'Tối thiểu 1 tháng' },
      { value: '3 months', label: 'Tối thiểu 3 tháng' },
      { value: '6 months', label: 'Tối thiểu 6 tháng' },
      { value: '1 year',   label: 'Tối thiểu 1 năm' },
    ],
    title: 'Tiêu đề tin đăng',
    titleHint: 'Bỏ trống thì hệ thống sẽ tự đặt tiêu đề.',
    description: 'Mô tả',
    descriptionHint: 'Mô tả căn nhà, khu vực xung quanh và những gì có sẵn. Viết bằng tiếng Việt hoặc tiếng Anh đều được.',
    photos: 'Hình ảnh',
    photosHint: 'Cần ít nhất 1 ảnh, tối đa 10 ảnh. JPEG, PNG hoặc WebP, mỗi ảnh tối đa 5 MB.',
    submit: 'Đăng tin',
    submitting: 'Đang đăng…',
    choose: 'Chọn…',
    optional: 'không bắt buộc',
    successTitle: 'Đã đăng tin thành công',
    successBody: url => `Tin đăng đã hiển thị tại ${url}`,
    successDelay: 'Tin có thể mất vài phút mới hiện trong kết quả tìm kiếm và các trang tin đăng, trong lúc website cập nhật.',
    addAnother: 'Đăng thêm tin',
    viewProfile: 'Xem hồ sơ',
    mustSignIn: 'Vui lòng đăng nhập để đăng tin.',
    needsName: 'Vui lòng thêm họ tên vào hồ sơ trước khi đăng tin.',
    notConfigured: 'Trang này chưa mở chức năng đăng tin.',
    uploadFailed: 'Chưa tải được ảnh lên. Vui lòng thử lại.',
    sheetFailed: 'Chưa lưu được tin đăng. Vui lòng thử lại sau ít phút.',
    notYours: 'Tin đăng này không thuộc tài khoản của anh/chị.',
    editTitle: 'Sửa tin đăng',
    editSubtitle: 'Nội dung sửa sẽ cập nhật lên website trong vài phút.',
    saveChanges: 'Lưu thay đổi',
    saving: 'Đang lưu…',
    savedTitle: 'Đã lưu thay đổi',
    myListings: 'Tin đăng của tôi',
    noListingsYet: 'Anh/chị chưa có tin đăng nào.',
    editThis: 'Sửa',
    photosCurrent: 'Ảnh hiện có',
    photoOrderHint: 'Dùng các nút mũi tên để đổi thứ tự ảnh. Ảnh đầu tiên sẽ hiện ở kết quả tìm kiếm và trên thẻ tin đăng.',
    heroLabel: 'Ảnh đại diện tin',
    heroHint: 'Ảnh đại diện tin là ảnh hiện đầu tiên, dùng ở kết quả tìm kiếm và trên thẻ tin đăng.',
    removePhoto: 'Xóa',
    moveEarlier: 'Lên trước',
    moveLater: 'Xuống sau',
    addMorePhotos: 'Thêm ảnh',
    backToListings: 'Quay lại tin đăng của tôi',
    errors: {
      type: 'Vui lòng chọn loại hình.',
      district: 'Vui lòng chọn quận/huyện.',
      price: 'Vui lòng nhập giá.',
      rentRange: 'Giá thuê có vẻ chưa đúng. Vui lòng kiểm tra lại số tiền và đơn vị tiền.',
      saleRange: 'Giá bán có vẻ chưa đúng. Vui lòng kiểm tra lại số tiền và đơn vị tiền.',
      description: 'Mô tả quá ngắn. Vui lòng viết ít nhất 30 ký tự.',
      photos: 'Vui lòng thêm ít nhất 1 ảnh.',
      agentName: 'Hồ sơ của anh/chị cần có họ tên trước khi đăng tin.',
      bedrooms: 'Vui lòng chọn số phòng ngủ.',
      bathrooms: 'Vui lòng chọn số phòng tắm.',
    },
  },
};

/** Property types, shown with Vietnamese labels but submitted with the English
 *  value the sheet stores (VALID_TYPES in lib/sheets.ts). */
// Only en/vi today — Korean and Russian read through forLang() and fall back to
// English until this copy is translated.
export const TYPE_LABELS: Record<'en' | 'vi', Record<string, string>> = {
  en: { Apartment: 'Apartment', Commercial: 'Commercial', House: 'House', Land: 'Land', Villa: 'Villa' },
  vi: { Apartment: 'Căn hộ', Commercial: 'Thương mại', House: 'Nhà phố', Land: 'Đất nền', Villa: 'Biệt thự' },
};

/** The same lists the search uses (lib/propertyTypes.ts): Land is for sale only. */
export { propertyTypesFor } from './propertyTypes';

/** Districts, English value + Vietnamese label. "Da Nang" is deliberately absent:
 *  it is the catch-all the scrapers fall back to, not something an agent posting
 *  a real property should pick. */
export const SUBMITTABLE_DISTRICTS = [
  'Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son',
  'Lien Chieu', 'Cam Le', 'Hoa Vang', 'Hoi An',
] as const;
