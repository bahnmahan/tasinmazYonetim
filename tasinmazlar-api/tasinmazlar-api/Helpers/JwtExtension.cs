using Microsoft.AspNetCore.Http;

namespace tasinmazlar_api.Helpers
{
    public static class JwtExtension
    {

        // Extensionlar static olmak zorunda.
        public static void AddApplicationError(this HttpResponse response, string message)
        {

            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Allow-Origin" , "*");
            response.Headers.Add("Access-Control-Expose-Header", "Application-Error");
        }

    }
}
