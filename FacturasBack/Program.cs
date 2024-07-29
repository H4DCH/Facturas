
using FacturasBack.Customs;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Repository;
using FacturasBack.Repository.IRepository;
using FacturasBack.Utilidades;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

namespace FacturasBack
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IFacturaRepository,FacturaRepository>();
            builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();
            builder.Services.AddScoped<IUsuarioRepositorio,UsuarioRepository>();
            builder.Services.AddSingleton<CreacionToken>();
            builder.Services.AddSingleton<Mayusculas>();

            
            builder.Services.AddDbContext<Context>(options => {
                options.UseSqlServer(builder.Configuration.GetConnectionString("Conexion"));
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("NuevaPolitica",app =>
                {
                    app.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().WithHeaders("content-disposition");
                });
            });
            builder.Services.AddAuthentication(config =>
            {
                config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(config =>
            {
                config.RequireHttpsMetadata = false;
                config.SaveToken = true;
                config.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey
                    (Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!))
                };
            });

            builder.Services.AddAutoMapper(typeof(Program));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthentication();

            app.UseHttpsRedirection();

            app.UseCors("NuevaPolitica");
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
