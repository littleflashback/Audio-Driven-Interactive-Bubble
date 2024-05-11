#ifdef GL_ES
precision mediump float;
#endif

#define MAX_Order 6
#define MAX_Ndim 49

uniform vec2 u_resolution;
uniform float u_t_from_last_peak;
uniform float u_peak_interval;
uniform float u_audioBrightness;
uniform float u_amplitude;
uniform float u_transparency_coef;
uniform float u_iridescence_coef;
uniform int Order;
uniform int BG_Mode;
uniform bool REF_Video;

// uniform samplerCube u_audioTexture;
uniform sampler2D u_audioTexture;
uniform sampler2D u_videoTexture;

varying vec2 vTexCoord;

// spherical harmonics coefficients
// reference: https://www.shadertoy.com/view/3tBXzc
const float k01 = 0.2820947918;
const float k02 = 0.4886025119; 
const float k03 = 1.0925484306; 
const float k04 = 0.3153915652; 
const float k05 = 0.5462742153; 
const float k06 = 0.5900435860; 
const float k07 = 2.8906114210;
const float k08 = 0.4570214810; 
const float k09 = 0.3731763300; 
const float k10 = 1.4453057110; 

void calcY(vec3 r, inout float o[MAX_Ndim]) {
    float x = r.x, y = r.y, z = r.z;
    float x2 = x*x, y2 = y*y, z2 = z*z;
    float x4 = x*x*x*x, y4 = y*y*y*y, z4 = z*z*z*z;
    float x6 = x*x*x*x*x*x, y6 = y*y*y*y*y*y, z6 = z*z*z*z*z*z;
    if (Order >= 0) {
        o[0]=k01;
    }
    if (Order >= 1) {
        o[1]=(-k02)*(y);
        o[2]=(k02)*(z);
        o[3]=(-k02)*(x);
    }
    if (Order >= 2) {
        o[4]=(-k03)*(x)*(y);
        o[5]=(-k03)*(y)*(z);
        o[6]=(-k04)*((x2)+(y2)+((-2.)*(z2)));
        o[7]=(-k03)*(x)*(z);
        o[8]=(k05)*((x2)+((-1.)*(y2)));
    }
    if (Order >= 3) {
        o[9]=(k06)*(y)*(((-3.)*(x2))+(y2));
        o[10]=(-k07)*(x)*(y)*(z);
        o[11]=(k08)*(y)*((x2)+(y2)+((-4.)*(z2)));
        o[12]=(k09)*(z)*(((-3.)*(x2))+((-3.)*(y2))+((2.)*(z2)));
        o[13]=(k08)*(x)*((x2)+(y2)+((-4.)*(z2)));
        o[14]=(k10)*((x2)+((-1.)*(y2)))*(z);
        o[15]=(-k06)*(x)*((x2)+((-3.)*(y2)));
    }
    if (Order >= 4) {
        o[16]=(2.5033429417)*(x)*(y)*(((-1.)*(x2))+(y2));
        o[17]=(1.7701307697)*(y)*(((-3.)*(x2))+(y2))*(z);
        o[18]=(0.9461746957)*(x)*(y)*((x2)+(y2)+((-6.)*(z2)));
        o[19]=(0.6690465435)*(y)*(z)*(((3.)*(x2))+((3.)*(y2))+((-4.)*(z2)));
        o[20]=(0.1057855469)*(((3.)*(x4))+((3.)*(y4))+((-24.)*(y2)*(z2))+((8.)*(z4))+((6.)*(x2)*((y2)+((-4.)*(z2)))));
        o[21]=(0.6690465435)*(x)*(z)*(((3.)*(x2))+((3.)*(y2))+((-4.)*(z2)));
        o[22]=(-0.4730873478)*((x2)+((-1.)*(y2)))*((x2)+(y2)+((-6.)*(z2)));
        o[23]=(-1.7701307697)*(x)*((x2)+((-3.)*(y2)))*(z);
        o[24]=(0.6258357354)*((x4)+((-6.)*(x2)*(y2))+(y4));
    }
    if (Order >= 5) {
        o[25]=(-0.6563820568)*(y)*(((5.)*(x4))+((-10.)*(x2)*(y2))+(y4));
        o[26]=(8.3026492595)*(x)*(y)*(((-1.)*(x2))+(y2))*(z);
        o[27]=(-0.4892382994)*(y)*(((-3.)*(x2))+(y2))*((x2)+(y2)+((-8.)*(z2)));
        o[28]=(4.7935367849)*(x)*(y)*(z)*((x2)+(y2)+((-2.)*(z2)));
        o[29]=(-0.45294665119)*(y)*((x4)+(y4)+((-12.)*(y2)*(z2))+((8.)*(z4))+((2.)*(x2)*((y2)+((-6.)*(z2)))));
        o[30]=(0.1169503224)*(z)*(((15.)*(x4))+((15.)*(y4))+((-40.)*(y2)*(z2))+((8.)*(z4))+((10.)*(x2)*(((3.)*(y2))+((-4.)*(z2)))));
        o[31]=(-0.45294665119)*(x)*((x4)+(y4)+((-12.)*(y2)*(z2))+((8.)*(z4))+((2.)*(x2)*((y2)+((-6.)*(z2)))));
        o[32]=(-2.39676839248)*((x2)+((-1.)*(y2)))*(z)*((x2)+(y2)+((-2.)*(z2)));
        o[33]=(0.4892382994)*(x)*((x2)+((-3.)*(y2)))*((x2)+(y2)+((-8.)*(z2)));
        o[34]=(2.0756623148)*((x4)+((-6.)*(x2)*(y2))+(y4))*(z);
        o[35]=(-0.6563820568)*(x)*((x4)+((-10.)*(x2)*(y2))+((5.)*(y4)));
    }
    if (Order >= 6) {
        o[36]=(-1.3663682103)*(x)*(y)*(((3.)*(x4))+((-10.)*(x2)*(y2))+((3.)*(y4)));
        o[37]=(-2.366619162)*(y)*(((5.)*(x4))+((-10.)*(x2)*(y2))+(y4))*(z);
        o[38]=(2.0182596029)*(x)*(y)*((x2)+((-1.)*(y2)))*((x2)+(y2)+((-10.)*(z2)));
        o[39]=(-0.9212052595)*(y)*(((-3.)*(x2))+(y2))*(z)*(((3.)*(x2))+((3.)*(y2))+((-8.)*(z2)));
        o[40]=(-0.9212052595)*(x)*(y)*((x4)+(y4)+((-16.)*(y2)*(z2))+((16.)*(z4))+((2.)*(x2)*((y2)+((-8.)*(z2)))));
        o[41]=(-0.5826213625)*(y)*(z)*(((5.)*(x4))+((5.)*(y4))+((-20.)*(y2)*(z2))+((8.)*(z4))+((10.)*(x2)*((y2)+((-2.)*(z2)))));
        o[42]=(-0.06356920226)*(((5.)*(x6))+((5.)*(y6))+((-90.)*(y4)*(z2))+((120.)*(y2)*(z4))+((-16.)*(z6))+((15.)*(x4)*((y2)+((-6.)*(z2))))+((15.)*(x2)*((y4)+((-12.)*(y2)*(z2))+((8.)*(z4)))));
        o[43]=(-0.5826213625)*(x)*(z)*(((5.)*(x4))+((5.)*(y4))+((-20.)*(y2)*(z2))+((8.)*(z4))+((10.)*(x2)*((y2)+((-2.)*(z2)))));
        o[44]=(0.4606026297)*((x2)+((-1.)*(y2)))*((x4)+(y4)+((-16.)*(y2)*(z2))+((16.)*(z4))+((2.)*(x2)*((y2)+((-8.)*(z2)))));
        o[45]=(0.9212052595)*(x)*((x2)+((-3.)*(y2)))*(z)*(((3.)*(x2))+((3.)*(y2))+((-8.)*(z2)));
        o[46]=(-0.5045649007)*((x4)+((-6.)*(x2)*(y2))+(y4))*((x2)+(y2)+((-10.)*(z2)));
        o[47]=(-2.366619162)*(x)*((x4)+((-10.)*(x2)*(y2))+((5.)*(y4)))*(z);
        o[48]=(0.6831841051)*((x6)+((-15.)*(x4)*(y2))+((15.)*(x2)*(y4))+((-1.)*(y6)));
    }

}


const int max_i = 48;
const int min_i = 4;
float displacement(vec3 r, float t) {
    float o[MAX_Ndim];
    calcY(r, o); 
    float ret = 0.;
    for (int l = 2; l <= MAX_Order; l++){
        if (l > Order) break;
        for (int m = -MAX_Order; m <= MAX_Order; m++) {
            if (m < -l || m > l) continue;
        // for (int m = -l; m <=l; m++) {
            int i = l*l+l-m;
            float omega = sqrt(float(l*(l-1)*(l+2)));
            for (int k = min_i; k <= max_i; ++k){
                if (i == k){
                    ret += o[k] * cos(t * omega) * exp(-0.02 * omega * t) / sqrt(float(2*l+1));   
                }                   
            }    
        }
    }
    return ret * -0.1;
}

float sdf(vec3 r) {
    float l = length(r) - 1.;
    if (abs(l) > 0.25) return l;
    return l - displacement(normalize(r), 0.1 * (u_t_from_last_peak - u_amplitude));
}

vec3 trace(vec3 ro, vec3 rd) {
    vec3 p = ro;
    float s;
    for (int i = 0; i < 50; i++) {
        s = sdf(p);
        p += rd * s;
    }
    if (s > 1e-3) return ro; 
    else return p; 
}

vec3 getNormal(vec3 p){
    return normalize(vec3(sdf(vec3(p.x + 0.001, p.y, p.z)),
                          sdf(vec3(p.x, p.y + 0.001, p.z)),
                          sdf(vec3(p.x, p.y, p.z + 0.001))
                        )-sdf(p));
}

// reflection & refraction
// reference: https://www.shadertoy.com/view/sdt3zH 
vec3 refractTex(vec3 camdir, vec3 norm, float eta){
    vec3 rd = refract(camdir, norm, eta);
    vec2 uv = rd.xy - .5;
    return texture2D(u_videoTexture, uv).rgb;
}

vec3 reflectTex(vec3 camdir, vec3 norm){
    vec3 rd = reflect(camdir, norm);
    vec2 uv = .5 - rd.xy*.3;
    return texture2D(u_videoTexture, uv).rgb;
}

vec3 illuminate(in vec3 pos, in vec3 camdir){
    vec3 norm = getNormal(pos);
    const float ETA=1.03;
    vec3 refrd = -refract(camdir, norm, ETA);
    vec3 refro = pos + 10.*refrd;
    float refdist = length(refro - trace(refro, refrd));
    vec3 refpos = refro + refdist * refrd;
    vec3 refnormal = getNormal(refpos);
    
    vec3 etaRatioRGB = vec3(1.02, 1.04, 1.07);
    
    vec3 refracted_color;
    refracted_color.r = refractTex(camdir, norm, etaRatioRGB.r).r;
    refracted_color.g = refractTex(camdir, norm, etaRatioRGB.g).g;
    refracted_color.b = refractTex(camdir, norm, etaRatioRGB.b).b;
    vec3 reflected_color = reflectTex(camdir, norm);
    vec3 texture = .8*refracted_color + .2*reflected_color;
    return texture;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // vec2 uv = (fragCoord * 2. - u_resolution.xy) / u_resolution.y;
    vec2 uv = (fragCoord - 0.5 * u_resolution.xy) / u_resolution.y;
    float theta = -1.0;
    float phi = -1.0;
    mat3 rot = mat3(
                cos(theta), 0, sin(theta),
                0, 1, 0,
                -sin(theta), 0, cos(theta))
                * mat3(
                1, 0, 0,
                0, cos(phi), sin(phi),
                0, -sin(phi), cos(phi)
                );
    vec3 ori = rot * vec3(-2.5 + u_audioBrightness, -1.25, 4);
    vec3 dir = rot * normalize(vec3(uv, -2));
    vec3 hit = trace(ori, dir);

    vec3 color = vec3(0.0);
    float dist = length(ori-hit);
    if (dist > 0.) {
        vec3 norm = getNormal(hit);

        float fresnel = pow(1.0 + dot(dir, norm), 3.0);
        vec4 tex_xz = texture2D(u_audioTexture, reflect(dir, norm).xz);
        // vec4 tex_xy = texture2D(u_audioTexture, reflect(dir, norm).xy);
        // vec4 tex_yz = texture2D(u_audioTexture, reflect(dir, norm).yz);

        if (REF_Video){
            vec3 p = ori + dir*dist;
            vec3 ref_video = illuminate(p, dir);

            color = mix(tex_xz.rgb, ref_video, tex_xz.a * u_transparency_coef); //Set transparancy coef
            color = mix(color, ref_video, fresnel);
        } else {
            color = mix(tex_xz.rgb, vec3(fresnel), tex_xz.a * u_transparency_coef);
        }
        // Simulate thin film interference (iridescence)
        float thickness = (sin(u_peak_interval * 2.0 + length(dir) * 2.0) + 1.0) * 0.5;
        vec3 iridescence = vec3(0.5) + 0.5 * cos(6.2831 * thickness + vec3(1, 2, 4));
        color += iridescence * u_iridescence_coef; //Set iridescence coef

        fragColor = vec4(color, 1.0);

    } else {
        if (BG_Mode == 0) fragColor = vec4(vec3(0.0), 1.0);
        else if (BG_Mode == 1) fragColor = vec4(1.0);
        else fragColor = vec4(texture2D(u_videoTexture, vTexCoord).rgb, 1.0);  
    }

}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
