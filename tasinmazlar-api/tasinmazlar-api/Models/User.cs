namespace tasinmazlar_api.Models
{
    public class User
    {

        public int id { get; set; }

        public string mailadress { get; set; }

        public byte[] passwordhash { get; set; }

        public byte[] passwordsalt { get; set; }

        public string username { get; set; }

        public string userlastname { get; set; }

        public string useradress { get; set; }

        public string userrole { get; set; }


    }
}
