using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using tasinmazlar_api.Models;


namespace tasinmazlar_api.Data
{
    public class AuthRepository : IAuthRepository
    {


        private tasinmazDbContext _context;
        public AuthRepository(tasinmazDbContext context) 
        {
        
            _context = context;  // database bağlantısı

        }
        public async Task<User> Register(User user, string password) 
        {
            byte[] passwordhash, passwordsalt;
            CreatePasswordHash(password, out passwordhash, out passwordsalt);

            user.passwordhash = passwordhash;
            user.passwordsalt = passwordsalt;

            await _context.users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;


        }


        private void CreatePasswordHash(string password, out byte[] passwordhash, out byte[] passwordsalt)
        {

            using (var hmac = new System.Security.Cryptography.HMACSHA256())
            {
                passwordsalt = hmac.Key;
                passwordhash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }



        public async Task<User> Login(string mailadress, string password)
        {

            var user = await _context.users.FirstOrDefaultAsync(x=> x.mailadress == mailadress);
            if (user == null)
            {
                return null;
            }

            if (!VerifyPasswordHash(password, user.passwordhash, user.passwordsalt))
            {
                return null;
            }

            return user;


        }

        private bool VerifyPasswordHash(string password, byte[] userpasswordhash, byte[] userpasswordsalt)
        {

            using (var hmac = new System.Security.Cryptography.HMACSHA256(userpasswordsalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != userpasswordhash[i])
                    {
                        return false;
                    }
                }

                return true;


            }

        }

        public async Task<bool> UserExist(string mailadress)
        {
            if (await _context.users.AnyAsync(x=> x.mailadress == mailadress))
            {
                return true;
            }

            return false;
        }
    }
}
