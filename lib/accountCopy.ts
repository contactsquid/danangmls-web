import type { Lang } from './translations';

/**
 * Copy for the agent account flow (sign up, sign in, reset, profile), in both
 * languages.
 *
 * This is the adoption barrier, not merely a translation nicety: near enough all
 * Da Nang agents are Vietnamese with very little English (Blake, 2026-08-13), so
 * an English-only sign-up means they cannot self-serve at all.
 */

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
  listingName: string;
  listingNameHint: string;
  saveProfile: string;
  savingProfile: string;
  signOut: string;
  adminLink: string;
  suspendedNotice: string;
  addListingPrompt: string;
  addListingButton: string;
  /** Header CTA. Deliberately shorter than addListingButton — it sits in a tight
   *  nav bar next to the rent/sale toggle. */
  addPropertyNav: string;
  slugHint: (slug: string) => string;
  independentRadio: string;
  agencyRadio: string;
  bioPlaceholder: string;
  listingNamePlaceholder: string;
  listingClaimVerified: string;
  // Action results
  errors: {
    notConfigured: string;
    nameRequired: string;
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
  };
  notices: {
    profileSaved: string;
  };
}

export const ACCOUNT_COPY: Record<Lang, AccountCopy> = {
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
    phoneHint: 'Not shown publicly. DanangMLS uses it to reach you about your listings.',
    listingName: 'Name used on your existing listings',
    listingNameHint:
      'If your properties are already on DanangMLS under a different name, enter it here and we will connect them to this profile after a quick check.',
    saveProfile: 'Save profile',
    savingProfile: 'Saving…',
    signOut: 'Sign out',
    adminLink: 'Admin — manage agents',
    suspendedNotice:
      'This profile is currently hidden from the public site. Contact DanangMLS if you think that is a mistake.',
    addListingPrompt: 'Ready to post a property?',
    addListingButton: 'Add a listing',
    addPropertyNav: 'Add property',
    slugHint: slug => `Your profile lives at /agent/${slug}. Changing your name here does not change that address.`,
    independentRadio: 'Independent agent',
    agencyRadio: 'Agency or company',
    bioPlaceholder: 'Areas you cover, languages you speak, the kind of property you specialise in…',
    listingNamePlaceholder: 'Exactly as it appears on your listings',
    listingClaimVerified: '✓ Verified — your listings appear on your public profile.',
    errors: {
      notConfigured: 'Agent accounts are not enabled on this site yet. Please try again later.',
      nameRequired: 'Please enter your full name.',
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
    signupSubtitle: 'Miễn phí. Tin đăng của bạn sẽ hiển thị trên DanangMLS dưới hồ sơ của riêng bạn.',
    fullName: 'Họ và tên',
    fullNameHint: 'Đây là tên hiển thị trên hồ sơ công khai của bạn.',
    namePlaceholder: 'Nguyễn Văn A',
    email: 'Email',
    password: 'Mật khẩu',
    passwordHint: 'Ít nhất 8 ký tự.',
    createAccount: 'Tạo tài khoản',
    creatingAccount: 'Đang tạo tài khoản…',
    haveAccount: 'Bạn đã có tài khoản?',
    signInLink: 'Đăng nhập',
    checkInbox:
      'Vui lòng kiểm tra email để xác nhận địa chỉ của bạn. Liên kết trong email sẽ đưa bạn quay lại đây để hoàn tất hồ sơ.',
    loginTitle: 'Đăng nhập',
    loginSubtitle: 'Đăng nhập để quản lý hồ sơ và tin đăng của bạn.',
    signIn: 'Đăng nhập',
    signingIn: 'Đang đăng nhập…',
    forgotPassword: 'Quên mật khẩu?',
    noAccount: 'Chưa có tài khoản?',
    signUpLink: 'Tạo tài khoản',
    resetTitle: 'Đặt lại mật khẩu',
    resetSubtitle: 'Chúng tôi sẽ gửi cho bạn một liên kết để đặt mật khẩu mới.',
    sendResetLink: 'Gửi liên kết đặt lại',
    sending: 'Đang gửi…',
    resetSent: 'Nếu địa chỉ này có tài khoản, một liên kết đặt lại mật khẩu đang được gửi đến.',
    newPasswordTitle: 'Đặt mật khẩu mới',
    newPasswordSubtitle: 'Chọn mật khẩu mới cho tài khoản của bạn.',
    newPassword: 'Mật khẩu mới',
    savePassword: 'Lưu mật khẩu',
    savingPassword: 'Đang lưu…',
    profileTitle: 'Hồ sơ môi giới của bạn',
    publicAt: 'Hiển thị công khai tại',
    profilePhoto: 'Ảnh đại diện',
    photoHint: 'JPEG, PNG hoặc WebP. Tối đa 5 MB.',
    bio: 'Giới thiệu về bạn',
    bioHint: 'Giới thiệu bản thân với khách thuê và khách mua. Bạn có thể viết bằng tiếng Việt hoặc tiếng Anh.',
    workplace: 'Nơi bạn làm việc',
    independentCheckbox: 'Tôi làm việc độc lập',
    agencyName: 'Tên công ty / sàn',
    phone: 'Điện thoại / Zalo',
    phoneHint: 'Không hiển thị công khai. DanangMLS dùng để liên hệ với bạn về tin đăng.',
    listingName: 'Tên đang dùng trên các tin đăng hiện có',
    listingNameHint:
      'Nếu bất động sản của bạn đã có trên DanangMLS dưới một tên khác, hãy nhập tên đó vào đây và chúng tôi sẽ liên kết chúng với hồ sơ này sau khi kiểm tra.',
    saveProfile: 'Lưu hồ sơ',
    savingProfile: 'Đang lưu…',
    signOut: 'Đăng xuất',
    adminLink: 'Quản trị — quản lý môi giới',
    suspendedNotice:
      'Hồ sơ này hiện đang bị ẩn khỏi trang công khai. Vui lòng liên hệ DanangMLS nếu bạn cho rằng đây là nhầm lẫn.',
    addListingPrompt: 'Bạn muốn đăng một bất động sản?',
    addListingButton: 'Đăng tin',
    addPropertyNav: 'Đăng tin',
    slugHint: slug => `Hồ sơ của bạn ở địa chỉ /vi/moi-gioi/${slug}. Việc đổi tên ở đây không làm thay đổi địa chỉ đó.`,
    independentRadio: 'Môi giới độc lập',
    agencyRadio: 'Công ty / sàn giao dịch',
    bioPlaceholder: 'Khu vực bạn phụ trách, ngôn ngữ bạn sử dụng, loại bất động sản bạn chuyên…',
    listingNamePlaceholder: 'Chính xác như tên hiển thị trên tin đăng của bạn',
    listingClaimVerified: '✓ Đã xác minh — tin đăng của bạn hiển thị trên hồ sơ công khai.',
    errors: {
      notConfigured: 'Tài khoản môi giới chưa được bật trên trang này. Vui lòng thử lại sau.',
      nameRequired: 'Vui lòng nhập họ và tên của bạn.',
      nameTooLong: 'Tên quá dài (tối đa 80 ký tự).',
      emailInvalid: 'Vui lòng nhập địa chỉ email hợp lệ.',
      passwordShort: 'Mật khẩu phải có ít nhất 8 ký tự.',
      credentialsRequired: 'Vui lòng nhập email và mật khẩu.',
      credentialsWrong: 'Email hoặc mật khẩu không đúng.',
      unconfirmed: 'Vui lòng xác nhận địa chỉ email của bạn trước — kiểm tra hộp thư để lấy liên kết.',
      signupFailed: 'Không thể tạo tài khoản. Vui lòng kiểm tra lại thông tin và thử lại.',
      emailRequired: 'Vui lòng nhập địa chỉ email của bạn.',
      resetExpired: 'Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu liên kết mới.',
      bioTooLong: 'Phần giới thiệu quá dài (tối đa 2.000 ký tự).',
      workplaceTooLong: 'Tên nơi làm việc quá dài.',
      photoType: 'Ảnh đại diện phải là định dạng JPEG, PNG hoặc WebP.',
      photoSize: 'Ảnh đại diện phải nhỏ hơn 5 MB.',
      photoUpload: 'Không tải được ảnh lên. Vui lòng thử lại.',
      saveFailed: 'Không lưu được hồ sơ. Vui lòng thử lại.',
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
