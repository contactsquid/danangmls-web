import type { Lang } from './translations';

/**
 * Copy for the agent account flow (sign up, sign in, reset, profile), in both
 * languages.
 *
 * This is the adoption barrier, not merely a translation nicety: near enough all
 * Da Nang agents are Vietnamese with very little English (Blake, 2026-08-13), so
 * an English-only sign-up means they cannot self-serve at all.
 */

/** Header nav label only. The account pages themselves are EN/VI, so this is a
 *  deliberate one-string override rather than a ko/ru AccountCopy (92 fields). */
export const ADD_PROPERTY_NAV = {
  en: 'Add property',
  vi: 'Đăng tin',
  ko: '매물 등록',
  ru: 'Разместить объект',
} as const;

export interface AccountCopy {
  // Sign up
  signupTitle: string;
  signupSubtitle: string;
  fullName: string;
  fullNameHint: string;
  namePlaceholder: string;
  email: string;
  password: string;
  passwordHint: string;
  createAccount: string;
  creatingAccount: string;
  haveAccount: string;
  signInLink: string;
  checkInbox: string;
  // Sign in
  loginTitle: string;
  loginSubtitle: string;
  signIn: string;
  signingIn: string;
  forgotPassword: string;
  noAccount: string;
  signUpLink: string;
  // Reset
  resetTitle: string;
  resetSubtitle: string;
  sendResetLink: string;
  sending: string;
  resetSent: string;
  // New password
  newPasswordTitle: string;
  newPasswordSubtitle: string;
  newPassword: string;
  savePassword: string;
  savingPassword: string;
  // Profile
  profileTitle: string;
  publicAt: string;
  profilePhoto: string;
  photoHint: string;
  bio: string;
  bioHint: string;
  workplace: string;
  independentCheckbox: string;
  agencyName: string;
  phone: string;
  phoneHint: string;
  signupPhoneHint: string;
  channelsLabel: string;
  channelsHint: string;
  whatsappLabel: string;
  zaloLabel: string;
  listingName: string;
  listingNameHint: string;
  saveProfile: string;
  savingProfile: string;
  signOut: string;
  deleteTitle: string;
  deleteBody: string;
  deleteConfirmLabel: string;
  /** Typed to confirm. Localised so it is not muscle memory from another site. */
  deleteConfirmWord: string;
  deleteButton: string;
  cancel: string;
  adminLink: string;
  suspendedNotice: string;
  addListingPrompt: string;
  addListingButton: string;
  /** Header CTA. Deliberately shorter than addListingButton — it sits in a tight
   *  nav bar next to the rent/sale toggle. */
  addPropertyNav: string;
  viewProfile: string;
  editProfile: string;
  accountMenuLabel: string;
  slugHint: (slug: string) => string;
  independentRadio: string;
  agencyRadio: string;
  bioPlaceholder: string;
  listingNamePlaceholder: string;
  listingClaimVerified: string;
  claimSearchHint: string;
  claimSearchPlaceholder: string;
  claimSearch: string;
  claimSearching: string;
  claimNoResults: string;
  claimConfirm: string;
  claimChange: string;
  claimCount: (n: number) => string;
  claimPending: (name: string) => string;
  claimSubmitted: string;
  claimSimilarHeading: string;
  claimSimilarConfirm: string;
  // Action results
  errors: {
    notConfigured: string;
    nameRequired: string;
    phoneRequired: string;
    nameTooLong: string;
    emailInvalid: string;
    passwordShort: string;
    credentialsRequired: string;
    credentialsWrong: string;
    unconfirmed: string;
    signupFailed: string;
    emailRequired: string;
    resetExpired: string;
    bioTooLong: string;
    workplaceTooLong: string;
    photoType: string;
    photoSize: string;
    photoUpload: string;
    saveFailed: string;
    deleteConfirm: string;
  };
  notices: {
    profileSaved: string;
  };
}

// Only en/vi today — Korean and Russian read through forLang() and fall back to
// English until this copy is translated.
export const ACCOUNT_COPY: Record<'en' | 'vi', AccountCopy> = {
  en: {
    signupTitle: 'Create your agent profile',
    signupSubtitle: 'Free. Your listings appear on DanangMLS under your own profile.',
    fullName: 'Full name',
    fullNameHint: 'This is the name shown on your public profile.',
    namePlaceholder: 'Nguyen Van A',
    email: 'Email',
    password: 'Password',
    passwordHint: 'At least 8 characters.',
    createAccount: 'Create account',
    creatingAccount: 'Creating account…',
    haveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    checkInbox:
      'Check your email to confirm your address. The link will bring you back here to finish your profile.',
    loginTitle: 'Sign in',
    loginSubtitle: 'Sign in to manage your profile and listings.',
    signIn: 'Sign in',
    signingIn: 'Signing in…',
    forgotPassword: 'Forgot your password?',
    noAccount: 'No account yet?',
    signUpLink: 'Create one',
    resetTitle: 'Reset your password',
    resetSubtitle: 'We will email you a link to set a new password.',
    sendResetLink: 'Send reset link',
    sending: 'Sending…',
    resetSent: 'If that address has an account, a reset link is on its way.',
    newPasswordTitle: 'Set a new password',
    newPasswordSubtitle: 'Choose a new password for your account.',
    newPassword: 'New password',
    savePassword: 'Save password',
    savingPassword: 'Saving…',
    profileTitle: 'Your agent profile',
    publicAt: 'Public at',
    profilePhoto: 'Profile photo',
    photoHint: 'JPEG, PNG, or WebP. Up to 5 MB.',
    bio: 'About you',
    bioHint: 'Tell buyers and renters who you are. Write in English or Vietnamese.',
    workplace: 'Where you work',
    independentCheckbox: 'I work independently',
    agencyName: 'Agency name',
    phone: 'Phone / Zalo',
    signupPhoneHint: 'Shown on your profile as Zalo and Message buttons so customers can '
      + 'reach you, and used by DanangMLS to contact you about your listings.',
    phoneHint: 'Shown on your public profile as Zalo and Message buttons so customers '
      + 'can reach you directly, and used by DanangMLS to contact you about your listings. '
      + 'Leave it blank to stay unlisted.',
    channelsLabel: 'Also on WhatsApp?',
    channelsHint: 'Most foreign tenants use WhatsApp. Tick this and a WhatsApp button is '
      + 'added to your profile alongside Zalo and Message.',
    whatsappLabel: 'Show a WhatsApp button for this number',
    zaloLabel: 'Zalo',
    listingName: 'Name used on your existing listings',
    listingNameHint:
      'If your properties are already on DanangMLS under a different name, enter it here and we will connect them to this profile after a quick check.',
    saveProfile: 'Save profile',
    savingProfile: 'Saving…',
    signOut: 'Sign out',
    deleteTitle: 'Delete your account',
    deleteBody: 'This removes your agent profile and stops all emails. It cannot be undone. Listings you posted stay on the site but will no longer link to a profile.',
    deleteConfirmLabel: 'Type DELETE to confirm',
    deleteConfirmWord: 'DELETE',
    deleteButton: 'Delete account',
    cancel: 'Cancel',
    adminLink: 'Admin — manage agents',
    suspendedNotice:
      'This profile is currently hidden from the public site. Contact DanangMLS if you think that is a mistake.',
    addListingPrompt: 'Ready to post a property?',
    addListingButton: 'Add a listing',
    addPropertyNav: 'Add property',
    viewProfile: 'View profile',
    editProfile: 'Edit profile',
    accountMenuLabel: 'Your account',
    slugHint: slug => `Your profile lives at /agent/${slug}. Changing your name here does not change that address.`,
    independentRadio: 'Independent agent',
    agencyRadio: 'Agency or company',
    bioPlaceholder: 'Areas you cover, languages you speak, the kind of property you specialise in…',
    listingNamePlaceholder: 'Exactly as it appears on your listings',
    listingClaimVerified: '✓ Verified — your listings appear on your public profile.',
    claimSearchHint: 'Already posting on Facebook? Search for your name to find listings we have already collected, and check they are yours.',
    claimSearchPlaceholder: 'Search your name…',
    claimSearch: 'Search',
    claimSearching: 'Searching…',
    claimNoResults: 'No listings found under that name. Try a shorter search, or just start posting — listings you add here are linked to you automatically.',
    claimConfirm: 'Yes, these are my listings',
    claimChange: 'Choose a different name',
    claimCount: n => `${n} listing${n === 1 ? '' : 's'} under this name`,
    claimPending: name => `Waiting for DanangMLS to review your claim to "${name}". Your listings appear on your profile once it is approved — usually within a day.`,
    claimSubmitted: 'Your claim has been sent to DanangMLS for review.',
    claimSimilarHeading: "Didn't match exactly, but close — is one of these you? (e.g. name order swapped, or Vietnamese vs. English spelling)",
    claimSimilarConfirm: 'Yes, this is me too',
    errors: {
      notConfigured: 'Agent accounts are not enabled on this site yet. Please try again later.',
      deleteConfirm: 'Please type DELETE exactly to confirm.',
      nameRequired: 'Please enter your full name.',
      phoneRequired: 'Please enter a valid Vietnamese mobile number, e.g. 0905 897 639.',
      nameTooLong: 'That name is too long (80 characters max).',
      emailInvalid: 'Please enter a valid email address.',
      passwordShort: 'Password must be at least 8 characters.',
      credentialsRequired: 'Enter your email and password.',
      credentialsWrong: 'Incorrect email or password.',
      unconfirmed: 'Please confirm your email address first — check your inbox for the link.',
      signupFailed: 'We could not create that account. Please check your details and try again.',
      emailRequired: 'Enter your email address.',
      resetExpired: 'Your reset link has expired. Request a new one.',
      bioTooLong: 'Your bio is too long (2,000 characters max).',
      workplaceTooLong: 'That workplace name is too long.',
      photoType: 'Profile photo must be a JPEG, PNG, or WebP image.',
      photoSize: 'Profile photo must be under 5 MB.',
      photoUpload: 'Could not upload your photo. Please try again.',
      saveFailed: 'Could not save your profile. Please try again.',
    },
    notices: { profileSaved: 'Profile saved.' },
  },
  vi: {
    signupTitle: 'Tạo hồ sơ môi giới',
    signupSubtitle: 'Miễn phí. Tin đăng của anh/chị hiển thị trên DanangMLS, gắn với hồ sơ riêng của anh/chị.',
    fullName: 'Họ và tên',
    fullNameHint: 'Tên này hiển thị trên hồ sơ công khai của anh/chị.',
    namePlaceholder: 'Nguyễn Văn A',
    email: 'Email',
    password: 'Mật khẩu',
    passwordHint: 'Tối thiểu 8 ký tự.',
    createAccount: 'Tạo tài khoản',
    creatingAccount: 'Đang tạo tài khoản…',
    haveAccount: 'Đã có tài khoản?',
    signInLink: 'Đăng nhập',
    checkInbox:
      'Anh/chị vui lòng mở email để xác nhận địa chỉ. Bấm vào liên kết trong email để quay lại đây và hoàn tất hồ sơ.',
    loginTitle: 'Đăng nhập',
    loginSubtitle: 'Đăng nhập để quản lý hồ sơ và tin đăng.',
    signIn: 'Đăng nhập',
    signingIn: 'Đang đăng nhập…',
    forgotPassword: 'Quên mật khẩu?',
    noAccount: 'Chưa có tài khoản?',
    signUpLink: 'Đăng ký',
    resetTitle: 'Đặt lại mật khẩu',
    resetSubtitle: 'Chúng tôi sẽ gửi liên kết đặt mật khẩu mới vào email của anh/chị.',
    sendResetLink: 'Gửi liên kết',
    sending: 'Đang gửi…',
    resetSent: 'Nếu email này đã đăng ký tài khoản, anh/chị sẽ nhận được liên kết đặt lại mật khẩu trong ít phút.',
    newPasswordTitle: 'Đặt mật khẩu mới',
    newPasswordSubtitle: 'Nhập mật khẩu mới cho tài khoản của anh/chị.',
    newPassword: 'Mật khẩu mới',
    savePassword: 'Lưu mật khẩu',
    savingPassword: 'Đang lưu…',
    profileTitle: 'Hồ sơ môi giới',
    publicAt: 'Trang công khai:',
    profilePhoto: 'Ảnh đại diện',
    photoHint: 'JPEG, PNG hoặc WebP, tối đa 5 MB.',
    bio: 'Giới thiệu',
    bioHint: 'Vài dòng giới thiệu bản thân để khách thuê và khách mua biết anh/chị là ai. Viết bằng tiếng Việt hoặc tiếng Anh đều được.',
    workplace: 'Nơi làm việc',
    independentCheckbox: 'Tôi làm môi giới tự do',
    agencyName: 'Tên công ty / sàn',
    phone: 'Điện thoại / Zalo',
    signupPhoneHint: 'Số này hiện trên hồ sơ thành nút Zalo và Nhắn tin để khách liên hệ anh/chị. '
      + 'DanangMLS cũng dùng số này để trao đổi với anh/chị về tin đăng.',
    phoneHint: 'Số này hiện trên hồ sơ công khai thành nút Zalo và Nhắn tin để khách liên hệ trực tiếp. '
      + 'DanangMLS cũng dùng số này để trao đổi với anh/chị về tin đăng. '
      + 'Để trống nếu anh/chị không muốn hiện số.',
    channelsLabel: 'Anh/chị có dùng WhatsApp không?',
    channelsHint: 'Phần lớn khách thuê nước ngoài dùng WhatsApp. Đánh dấu ô này để thêm nút WhatsApp '
      + 'vào hồ sơ, cạnh nút Zalo và Nhắn tin.',
    whatsappLabel: 'Hiện nút WhatsApp cho số này',
    zaloLabel: 'Zalo',
    listingName: 'Tên trên các tin đăng hiện có',
    listingNameHint:
      'Nếu nhà của anh/chị đã có trên DanangMLS dưới một tên khác, hãy nhập tên đó vào đây. Chúng tôi sẽ kiểm tra rồi gắn các tin đó vào hồ sơ này.',
    saveProfile: 'Lưu hồ sơ',
    savingProfile: 'Đang lưu…',
    signOut: 'Đăng xuất',
    deleteTitle: 'Xóa tài khoản',
    deleteBody: 'Hồ sơ môi giới của anh/chị sẽ bị xóa và anh/chị sẽ không nhận email nào từ chúng tôi nữa. Thao tác này không thể hoàn tác. Các tin anh/chị đã đăng vẫn hiển thị trên website nhưng không còn liên kết tới hồ sơ.',
    deleteConfirmLabel: 'Nhập XOA để xác nhận',
    deleteConfirmWord: 'XOA',
    deleteButton: 'Xóa tài khoản',
    cancel: 'Hủy',
    adminLink: 'Quản trị — quản lý môi giới',
    suspendedNotice:
      'Hồ sơ này đang tạm ẩn khỏi trang công khai. Nếu anh/chị cho rằng có nhầm lẫn, vui lòng liên hệ DanangMLS.',
    addListingPrompt: 'Anh/chị có nhà cần đăng?',
    addListingButton: 'Đăng tin',
    addPropertyNav: 'Đăng tin',
    viewProfile: 'Xem hồ sơ',
    editProfile: 'Sửa hồ sơ',
    accountMenuLabel: 'Tài khoản',
    slugHint: slug => `Địa chỉ hồ sơ của anh/chị là /vi/moi-gioi/${slug}. Đổi tên ở đây không làm thay đổi địa chỉ này.`,
    independentRadio: 'Môi giới tự do',
    agencyRadio: 'Công ty / sàn giao dịch',
    bioPlaceholder: 'Khu vực anh/chị phụ trách, ngoại ngữ anh/chị sử dụng, loại nhà anh/chị chuyên…',
    listingNamePlaceholder: 'Ghi đúng như tên trên tin đăng',
    listingClaimVerified: '✓ Đã xác minh — tin đăng của anh/chị đang hiển thị trên hồ sơ công khai.',
    claimSearchHint: 'Anh/chị đã đăng tin trên Facebook? Tìm theo tên để xem những tin chúng tôi đã tổng hợp, rồi xác nhận đó là tin của anh/chị.',
    claimSearchPlaceholder: 'Nhập tên của anh/chị…',
    claimSearch: 'Tìm kiếm',
    claimSearching: 'Đang tìm…',
    claimNoResults: 'Không có tin đăng nào dưới tên này. Anh/chị thử gõ ngắn hơn, hoặc cứ bắt đầu đăng tin — tin đăng tại đây sẽ tự động gắn với hồ sơ của anh/chị.',
    claimConfirm: 'Đúng, đây là tin của tôi',
    claimChange: 'Chọn tên khác',
    claimCount: n => `${n} tin đăng dưới tên này`,
    claimPending: name => `DanangMLS đang xét yêu cầu nhận tên "${name}" của anh/chị. Sau khi duyệt, tin đăng sẽ hiện trên hồ sơ — thường trong vòng một ngày.`,
    claimSubmitted: 'Đã gửi yêu cầu. DanangMLS sẽ xét duyệt sớm.',
    claimSimilarHeading: 'Không trùng khớp hoàn toàn nhưng khá giống — có tên nào là của anh/chị không? (ví dụ: đảo thứ tự họ tên, hoặc viết có dấu / không dấu)',
    claimSimilarConfirm: 'Đúng, đây cũng là tôi',
    errors: {
      notConfigured: 'Trang này chưa mở tài khoản môi giới. Anh/chị vui lòng thử lại sau.',
      deleteConfirm: 'Vui lòng nhập đúng chữ XOA để xác nhận.',
      nameRequired: 'Vui lòng nhập họ và tên.',
      phoneRequired: 'Vui lòng nhập số di động Việt Nam hợp lệ, ví dụ 0905 897 639.',
      nameTooLong: 'Tên quá dài (tối đa 80 ký tự).',
      emailInvalid: 'Email không hợp lệ.',
      passwordShort: 'Mật khẩu phải có ít nhất 8 ký tự.',
      credentialsRequired: 'Vui lòng nhập email và mật khẩu.',
      credentialsWrong: 'Email hoặc mật khẩu không đúng.',
      unconfirmed: 'Anh/chị chưa xác nhận email. Vui lòng mở hộp thư và bấm vào liên kết xác nhận.',
      signupFailed: 'Chưa tạo được tài khoản. Anh/chị vui lòng kiểm tra lại thông tin và thử lại.',
      emailRequired: 'Vui lòng nhập email.',
      resetExpired: 'Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu liên kết mới.',
      bioTooLong: 'Phần giới thiệu quá dài (tối đa 2.000 ký tự).',
      workplaceTooLong: 'Tên nơi làm việc quá dài.',
      photoType: 'Ảnh đại diện phải ở định dạng JPEG, PNG hoặc WebP.',
      photoSize: 'Ảnh đại diện phải nhỏ hơn 5 MB.',
      photoUpload: 'Chưa tải được ảnh lên. Vui lòng thử lại.',
      saveFailed: 'Chưa lưu được hồ sơ. Vui lòng thử lại.',
    },
    notices: { profileSaved: 'Đã lưu hồ sơ.' },
  },
};

/** Route map per language. The English account area keeps its existing /account
 *  paths; Vietnamese mirrors it under /vi/tai-khoan with Vietnamese slugs. */
export const accountPaths = {
  en: {
    signup: '/account/signup',
    login: '/account/login',
    reset: '/account/reset',
    password: '/account/password',
    profile: '/account/profile',
    newListing: '/account/listings/new',
  },
  vi: {
    signup: '/vi/tai-khoan/dang-ky',
    login: '/vi/tai-khoan/dang-nhap',
    reset: '/vi/tai-khoan/quen-mat-khau',
    password: '/vi/tai-khoan/mat-khau',
    profile: '/vi/tai-khoan/ho-so',
    newListing: '/vi/tai-khoan/dang-tin',
  },
} as const;

/** Only ever redirect to a path on this site. A `next` value arrives from the
 *  query string, so without this an attacker could craft a link that logs a user
 *  in and bounces them to an external page — including `//evil.com`, which the
 *  browser reads as protocol-relative and absolute. */
export function safeNext(next: string | undefined, fallback: string): string {
  if (!next) return fallback;
  if (!next.startsWith('/') || next.startsWith('//')) return fallback;
  return next;
}

