using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace tasinmazlar_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NeighborhoodController : ControllerBase
    {

        private readonly IConfiguration neighborhoodConnection;

        public NeighborhoodController(IConfiguration configuration)
        {
            neighborhoodConnection = configuration;
        }

        [HttpGet]

        public JsonResult Get(int districtid)
        {
            string query = @"
                select neighborhoodid as ""mahalleid"",
                       neighborhoodname as ""mahalleadi"",
                       districtid as ""districtid""
                    from neighborhoods
                    WHERE districtid = @districtid
                    ";

            DataTable table = new DataTable();
            string sqlDataSource = neighborhoodConnection.GetConnectionString("getConnectionHere");
            NpgsqlDataReader neighborhoodReader;
            using (NpgsqlConnection neigborhoodConnection = new NpgsqlConnection(sqlDataSource))
            {
                neigborhoodConnection.Open();
                using (NpgsqlCommand neighborhoodCommand = new NpgsqlCommand(query, neigborhoodConnection))
                {
                    neighborhoodCommand.Parameters.AddWithValue("@districtid", districtid);


                    neighborhoodReader = neighborhoodCommand.ExecuteReader();
                    table.Load(neighborhoodReader);

                    neighborhoodReader.Close();
                    neigborhoodConnection.Close();

                }
            }

            return new JsonResult(table);


        }

    }
}
