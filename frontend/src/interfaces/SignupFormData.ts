interface SignupFormData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: string;
  profileImageFile?: File | null;
}

export default SignupFormData;
