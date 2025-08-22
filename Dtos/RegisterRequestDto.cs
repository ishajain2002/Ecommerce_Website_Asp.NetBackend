namespace E_mart.Dtos
{
    public class RegisterRequestDto
    {
        public string Username { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public bool Loyalty { get; set; }
    }
}
