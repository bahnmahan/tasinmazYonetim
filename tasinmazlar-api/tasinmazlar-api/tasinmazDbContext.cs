using Microsoft.EntityFrameworkCore;
using tasinmazlar_api.Models;

namespace tasinmazlar_api
{

    public class tasinmazDbContext : DbContext
    {

        public tasinmazDbContext(DbContextOptions<tasinmazDbContext> option):base(option) 
        { 
        


        }

        public DbSet<User> users { get; set; }

    }

}
