using System.Threading.Tasks;
using tasinmazlar_api.Models;

namespace tasinmazlar_api.Data
{
    public interface IAuthRepository
    {

        // Authentication Repository

        Task<User> Register(User user, string password);  // Kullanıcı Kaydet
        Task<User> Login(string username, string password);  // Kullanıcı Giriş Yap
        Task<bool> UserExist(string username);  // Kullanıcı Kontrol Et - bool, varsa true döner yoksa false döner 

    }
}
